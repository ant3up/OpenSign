import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();
import http from 'http';

// Create the basic Express app first
export const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic middleware
app.use(function (req, res, next) {
  req.headers['x-real-ip'] = getUserIP(req);
  const publicUrl = 'https://' + req?.get('host');
  req.headers['public_url'] = publicUrl;
  next();
});

function getUserIP(request) {
  let forwardedFor = request.headers['x-forwarded-for'];
  if (forwardedFor) {
    if (forwardedFor.indexOf(',') > -1) {
      return forwardedFor.split(',')[0];
    } else {
      return forwardedFor;
    }
  } else {
    return request.socket.remoteAddress;
  }
}

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Basic health check endpoints - respond immediately
app.get('/', function (req, res) {
  res.status(200).send('opensign-server is running !!!');
});

app.get('/health', function (req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'opensign-server',
    message: 'Basic server is running'
  });
});

// Start the server immediately
const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);
httpServer.keepAliveTimeout = 100000;
httpServer.headersTimeout = 100000;

httpServer.listen(port, '0.0.0.0', function () {
  console.log('✅ Basic OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  
  // Now initialize Parse Server and other components asynchronously
  initializeAdvancedComponents();
});

// Initialize complex components after server is running
async function initializeAdvancedComponents() {
  try {
    console.log('🔄 Initializing Parse Server and other components...');
    
    // Import complex dependencies
    const { ParseServer } = await import('parse-server');
    const { appName, cloudServerUrl, serverAppId, smtpenable, smtpsecure, useLocal } = await import('./Utils.js');
    const { app as customRoute } = await import('./cloud/customRoute/customApp.js');
    const { SSOAuth } = await import('./auth/authadapter.js');
    const createContactIndex = await import('./migrationdb/createContactIndex.js');
    const { validateSignedLocalUrl } = await import('./cloud/parsefunction/getSignedUrl.js');
    
    // Initialize file adapter
    let fsAdapter;
    if (useLocal !== 'true') {
      try {
        const AWS = await import('aws-sdk');
        const S3Adapter = await import('@parse/s3-files-adapter');
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_ENDPOINT);
        const s3Options = {
          bucket: process.env.DO_SPACE,
          baseUrl: process.env.DO_BASEURL,
          fileAcl: 'none',
          region: process.env.DO_REGION,
          directAccess: true,
          preserveFileName: true,
          presignedUrl: true,
          presignedUrlExpires: 900,
          s3overrides: {
            credentials: {
              accessKeyId: process.env.DO_ACCESS_KEY_ID,
              secretAccessKey: process.env.DO_SECRET_ACCESS_KEY,
            },
            endpoint: spacesEndpoint,
          },
        };
        fsAdapter = new S3Adapter(s3Options);
      } catch (err) {
        console.log('Please provide AWS credentials in env file! Defaulting to local storage.');
        const FSFilesAdapter = await import('@parse/fs-files-adapter');
        fsAdapter = new FSFilesAdapter({
          filesSubDirectory: 'files',
        });
      }
    } else {
      const FSFilesAdapter = await import('@parse/fs-files-adapter');
      fsAdapter = new FSFilesAdapter({
        filesSubDirectory: 'files',
      });
    }

    // Initialize email adapter
    let transporterMail;
    let mailgunClient;
    let mailgunDomain;
    let isMailAdapter = false;
    let mailsender;
    
    if (smtpenable) {
      try {
        const { createTransport } = await import('nodemailer');
        transporterMail = createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 465,
          secure: smtpsecure,
          auth: {
            user: process.env.SMTP_USERNAME ? process.env.SMTP_USERNAME : process.env.SMTP_USER_EMAIL,
            pass: process.env.SMTP_PASS,
          },
        });
        await transporterMail.verify();
        isMailAdapter = true;
        mailsender = process.env.SMTP_USER_EMAIL;
      } catch (err) {
        isMailAdapter = false;
        console.log('Please provide valid SMTP credentials');
      }
    } else if (process.env.MAILGUN_API_KEY) {
      try {
        const Mailgun = await import('mailgun.js');
        const formData = await import('form-data');
        const { ApiPayloadConverter } = await import('parse-server-api-mail-adapter');
        const mailgun = new Mailgun(formData);
        mailgunClient = mailgun.client({
          username: 'api',
          key: process.env.MAILGUN_API_KEY,
        });
        mailgunDomain = process.env.MAILGUN_DOMAIN;
        isMailAdapter = true;
        mailsender = process.env.MAILGUN_SENDER;
      } catch (error) {
        isMailAdapter = false;
        console.log('Please provide valid Mailgun credentials');
      }
    }

    // Parse Server configuration
    const config = {
      databaseURI: process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dev',
      cloud: function () {
        import('./cloud/main.js');
      },
      appId: serverAppId,
      logLevel: ['error'],
      maxLimit: 500,
      maxUploadSize: '30mb',
      masterKey: process.env.MASTER_KEY,
      masterKeyIps: ['0.0.0.0/0', '::/0'],
      serverURL: cloudServerUrl,
      verifyUserEmails: false,
      publicServerURL: process.env.SERVER_URL || cloudServerUrl,
      appName: appName,
      allowClientClassCreation: false,
      allowExpiredAuthDataToken: false,
      encodeParseObjectInCloudFunction: true,
      filesAdapter: fsAdapter,
      auth: { google: { enabled: true }, sso: SSOAuth },
      push: { queueOptions: { disablePushWorker: true } },
    };

    // Add email adapter if configured
    if (isMailAdapter) {
      config.emailAdapter = {
        module: 'parse-server-api-mail-adapter',
        options: {
          sender: appName + ' <' + mailsender + '>',
          templates: {
            passwordResetEmail: {
              subjectPath: './files/password_reset_email_subject.txt',
              textPath: './files/password_reset_email.txt',
              htmlPath: './files/password_reset_email.html',
            },
            verificationEmail: {
              subjectPath: './files/verification_email_subject.txt',
              textPath: './files/verification_email.txt',
              htmlPath: './files/verification_email.html',
            },
          },
          apiCallback: async ({ payload, locale }) => {
            if (mailgunClient) {
              const { ApiPayloadConverter } = await import('parse-server-api-mail-adapter');
              const mailgunPayload = ApiPayloadConverter.mailgun(payload);
              await mailgunClient.messages.create(mailgunDomain, mailgunPayload);
            } else if (transporterMail) await transporterMail.sendMail(payload);
          },
        },
      };
    }

    // Start Parse Server
    console.log('🔌 Connecting to MongoDB...');
    console.log('📊 Database URI:', config.databaseURI);
    
    const server = new ParseServer(config);
    await server.start();
    
    console.log('✅ Parse Server started successfully!');
    console.log('🌐 Server URL:', config.serverURL);
    console.log('🔑 App ID:', config.appId);
    
    // Mount Parse Server
    const mountPath = process.env.PARSE_MOUNT || '/app';
    app.use(mountPath, server.app);
    
    // Mount custom routes
    app.use('/', customRoute);
    
    // Update health check to show full status
    app.get('/health', function (req, res) {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'opensign-server',
        message: 'Full server is running',
        database: config.databaseURI ? 'configured' : 'not configured',
        serverUrl: config.serverURL,
        appId: config.appId
      });
    });
    
    // Run database migrations
    const { exec } = await import('child_process');
    createContactIndex();
    const isWindows = process.platform === 'win32';
    const migrate = isWindows
      ? `set APPLICATION_ID=${serverAppId}&& set SERVER_URL=${cloudServerUrl}&& set MASTER_KEY=${process.env.MASTER_KEY}&& npx parse-dbtool migrate`
      : `APPLICATION_ID=${serverAppId} SERVER_URL=${cloudServerUrl} MASTER_KEY=${process.env.MASTER_KEY} npx parse-dbtool migrate`;
    
    exec(migrate, (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Migration Error: ${stderr}`);
        return;
      }
      console.log(`Migration output: ${stdout}`);
    });
    
    console.log('🎉 OpenSign server fully initialized!');
    
  } catch (err) {
    console.error('❌ Error initializing advanced components:', err);
    console.log('⚠️ Server is running with basic functionality only');
  }
}
