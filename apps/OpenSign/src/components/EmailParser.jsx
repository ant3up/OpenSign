import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EmailParser = ({ onEmailDataExtracted }) => {
  const { t } = useTranslation();
  const [emailText, setEmailText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  const parseEmail = (emailContent) => {
    const lines = emailContent.split('\n');
    const parsed = {
      subject: '',
      from: '',
      to: '',
      cc: '',
      date: '',
      body: '',
      headers: {}
    };

    let isInBody = false;
    let bodyLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!isInBody) {
        // Parse headers
        if (line.startsWith('Subject:')) {
          parsed.subject = line.substring(8).trim();
        } else if (line.startsWith('From:')) {
          parsed.from = line.substring(6).trim();
        } else if (line.startsWith('To:')) {
          parsed.to = line.substring(4).trim();
        } else if (line.startsWith('Cc:')) {
          parsed.cc = line.substring(4).trim();
        } else if (line.startsWith('Date:')) {
          parsed.date = line.substring(6).trim();
        } else if (line.includes(':')) {
          const [key, value] = line.split(':', 2);
          parsed.headers[key.trim()] = value.trim();
        } else if (line === '') {
          // Empty line indicates start of body
          isInBody = true;
        }
      } else {
        // Collect body lines
        bodyLines.push(line);
      }
    }

    parsed.body = bodyLines.join('\n').trim();
    return parsed;
  };

  const extractStructuredData = (parsedEmail) => {
    const data = {};
    const allText = `${parsedEmail.subject} ${parsedEmail.body}`.toLowerCase();

    // Extract common patterns
    const patterns = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      phone: /(\+?[\d\s\-\(\)]{10,})/g,
      date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
      amount: /(\$[\d,]+\.?\d*)/g,
      zipCode: /(\d{5}(-\d{4})?)/g,
      accountNumber: /(account\s*#?\s*:?\s*[\d\-]+)/gi,
      invoiceNumber: /(invoice\s*#?\s*:?\s*[\w\d\-]+)/gi,
      referenceNumber: /(ref\s*#?\s*:?\s*[\w\d\-]+)/gi
    };

    // Extract using patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const matches = allText.match(pattern);
      if (matches && matches.length > 0) {
        data[key] = matches[0];
      }
    }

    // Extract structured data using common formats
    const structuredPatterns = [
      {
        name: 'name',
        pattern: /(?:name|full\s*name|customer|client|applicant)\s*:?\s*([^,\n\r]+)/i,
        examples: ['name:', 'full name:', 'customer name:', 'client name:']
      },
      {
        name: 'company',
        pattern: /(?:company|organization|corporation|business)\s*:?\s*([^,\n\r]+)/i,
        examples: ['company:', 'organization:', 'corporation:', 'business:']
      },
      {
        name: 'address',
        pattern: /(?:address|street|mailing)\s*:?\s*([^,\n\r]+)/i,
        examples: ['address:', 'street address:', 'mailing address:']
      },
      {
        name: 'city',
        pattern: /(?:city|town)\s*:?\s*([^,\n\r]+)/i,
        examples: ['city:', 'town:']
      },
      {
        name: 'state',
        pattern: /(?:state|province)\s*:?\s*([^,\n\r]+)/i,
        examples: ['state:', 'province:']
      },
      {
        name: 'job_title',
        pattern: /(?:job\s*title|position|title|role)\s*:?\s*([^,\n\r]+)/i,
        examples: ['job title:', 'position:', 'title:', 'role:']
      },
      {
        name: 'amount',
        pattern: /(?:amount|total|sum|price|cost)\s*:?\s*(\$?[\d,]+\.?\d*)/i,
        examples: ['amount:', 'total:', 'sum:', 'price:', 'cost:']
      },
      {
        name: 'due_date',
        pattern: /(?:due\s*date|deadline|expiration|expiry)\s*:?\s*([^,\n\r]+)/i,
        examples: ['due date:', 'deadline:', 'expiration date:', 'expiry date:']
      }
    ];

    for (const { name, pattern, examples } of structuredPatterns) {
      const match = allText.match(pattern);
      if (match && match[1]) {
        data[name] = match[1].trim();
      }
    }

    // Extract from email headers
    if (parsedEmail.from) {
      const fromMatch = parsedEmail.from.match(/^([^<]+)<([^>]+)>$/);
      if (fromMatch) {
        data.sender_name = fromMatch[1].trim();
        data.sender_email = fromMatch[2].trim();
      } else {
        data.sender_email = parsedEmail.from;
      }
    }

    return data;
  };

  const handleParseEmail = () => {
    if (!emailText.trim()) {
      return;
    }

    setIsParsing(true);
    
    try {
      const parsedEmail = parseEmail(emailText);
      const structuredData = extractStructuredData(parsedEmail);
      
      const result = {
        ...parsedEmail,
        extractedData: structuredData
      };
      
      setParsedData(result);
      onEmailDataExtracted(result);
    } catch (error) {
      console.error('Error parsing email:', error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEmailText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('email-content')}
        </label>
        
        {/* File Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept=".txt,.eml"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Text Input */}
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('paste-email-content-here')}
        />
      </div>

      <button
        onClick={handleParseEmail}
        disabled={!emailText.trim() || isParsing}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isParsing ? t('parsing') : t('parse-email')}
      </button>

      {/* Parsed Results */}
      {parsedData && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">{t('parsed-email-data')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Headers */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{t('email-headers')}</h4>
              <div className="space-y-1 text-sm">
                {parsedData.subject && (
                  <div><span className="font-medium">Subject:</span> {parsedData.subject}</div>
                )}
                {parsedData.from && (
                  <div><span className="font-medium">From:</span> {parsedData.from}</div>
                )}
                {parsedData.to && (
                  <div><span className="font-medium">To:</span> {parsedData.to}</div>
                )}
                {parsedData.cc && (
                  <div><span className="font-medium">Cc:</span> {parsedData.cc}</div>
                )}
                {parsedData.date && (
                  <div><span className="font-medium">Date:</span> {parsedData.date}</div>
                )}
              </div>
            </div>

            {/* Extracted Data */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{t('extracted-data')}</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(parsedData.extractedData).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Body Preview */}
          {parsedData.body && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">{t('email-body-preview')}</h4>
              <div className="bg-white border border-gray-200 p-4 rounded-md max-h-40 overflow-y-auto text-sm">
                <pre className="whitespace-pre-wrap">{parsedData.body}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailParser;

