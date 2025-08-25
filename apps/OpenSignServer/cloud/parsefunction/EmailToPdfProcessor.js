import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import fs from 'fs';
import { uploadFile } from '../customRoute/uploadFile.js';

/**
 * Email to PDF Template Processor
 * This function processes email content and intelligently maps data to PDF form fields
 */

// Common field mappings for intelligent data extraction
const FIELD_MAPPINGS = {
  // Personal Information
  'name': ['name', 'full name', 'fullname', 'customer name', 'client name', 'applicant name'],
  'first_name': ['first name', 'firstname', 'given name', 'forename'],
  'last_name': ['last name', 'lastname', 'surname', 'family name'],
  'email': ['email', 'email address', 'e-mail', 'e-mail address'],
  'phone': ['phone', 'phone number', 'telephone', 'telephone number', 'mobile', 'mobile number'],
  
  // Address Information
  'address': ['address', 'street address', 'mailing address', 'home address'],
  'city': ['city', 'town', 'municipality'],
  'state': ['state', 'province', 'region'],
  'zip_code': ['zip', 'zip code', 'postal code', 'postcode'],
  'country': ['country', 'nation'],
  
  // Business Information
  'company': ['company', 'organization', 'corporation', 'business', 'employer'],
  'job_title': ['job title', 'position', 'title', 'role', 'occupation'],
  'department': ['department', 'division', 'unit'],
  
  // Financial Information
  'amount': ['amount', 'total', 'sum', 'price', 'cost', 'value'],
  'currency': ['currency', 'dollars', 'euros', 'pounds'],
  'account_number': ['account number', 'account #', 'acct number'],
  'invoice_number': ['invoice number', 'invoice #', 'inv number'],
  
  // Dates
  'date': ['date', 'today', 'current date', 'submission date'],
  'due_date': ['due date', 'deadline', 'expiration date', 'expiry date'],
  'start_date': ['start date', 'beginning date', 'effective date'],
  'end_date': ['end date', 'termination date', 'completion date'],
  
  // Document Information
  'document_title': ['document title', 'title', 'subject', 'document name'],
  'reference_number': ['reference number', 'ref number', 'reference #', 'ref #'],
  'case_number': ['case number', 'case #', 'file number'],
  
  // Real Estate Specific Fields
  'property_address': ['property address', 'address', 'street address', 'location'],
  'property_type': ['property type', 'unit', 'house', 'apartment', 'townhouse'],
  'bedrooms': ['bedrooms', 'beds', 'bed'],
  'bathrooms': ['bathrooms', 'baths', 'bath'],
  'parking': ['parking', 'car spaces', 'garage'],
  'price_range': ['price range', 'price', 'value', 'estimate'],
  'auction_date': ['auction date', 'auction', 'sale date'],
  'commission_rate': ['commission', 'commission rate', 'rate', 'percentage'],
  'bonus_rate': ['bonus', 'bonus rate', 'bonus percentage'],
  'possession_type': ['possession', 'vacant possession', 'settlement'],
  'marketing_period': ['marketing period', 'period', 'duration', 'months'],
  'first_open': ['first open', 'open house', 'inspection'],
  
  // Marketing Costs
  'online_websites': ['online websites', 'website costs'],
  'rea_showcase': ['rea showcase', 'real estate showcase'],
  'photos_floorplan': ['photos', 'floorplan', 'photos/floorplan'],
  'brochures': ['brochures', 'flyers'],
  'dl': ['dl', 'direct mail'],
  'auction_cost': ['auction cost', 'auction fee'],
  'signboard': ['signboard', 'sign board', 'for sale sign'],
  
  // Contact Information
  'agent_name': ['agent name', 'sales associate', 'agent'],
  'agent_phone': ['agent phone', 'agent mobile', 'agent contact'],
  'agent_email': ['agent email', 'agent contact email'],
  'office_name': ['office name', 'real estate office', 'agency'],
  'office_phone': ['office phone', 'office contact'],
  'office_address': ['office address', 'office location'],
  'website': ['website', 'web address', 'url'],
  
  // Additional Fields
  'notes': ['notes', 'comments', 'remarks', 'additional information'],
  'description': ['description', 'details', 'explanation'],
  'signature': ['signature', 'sign', 'signed by', 'authorized by']
};

// Field type detection patterns
const FIELD_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  date: /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$|^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
  amount: /^\$?[\d,]+\.?\d*$/,
  zip_code: /^\d{5}(-\d{4})?$/,
  account_number: /^\d{4,17}$/
};

/**
 * Extract text content from email
 */
function extractEmailContent(emailData) {
  const content = {
    subject: emailData.subject || '',
    body: emailData.body || emailData.text || '',
    from: emailData.from || '',
    to: emailData.to || '',
    cc: emailData.cc || '',
    date: emailData.date || new Date().toISOString(),
    attachments: emailData.attachments || []
  };
  
  return content;
}

/**
 * Extract potential field values from email content
 */
function extractFieldValues(emailContent) {
  const extractedData = {};
  const allText = `${emailContent.subject} ${emailContent.body}`.toLowerCase();
  
  // Extract structured data using patterns
  for (const [fieldType, pattern] of Object.entries(FIELD_PATTERNS)) {
    const matches = allText.match(new RegExp(pattern.source, 'gi'));
    if (matches && matches.length > 0) {
      extractedData[fieldType] = matches[0];
    }
  }
  
  // Extract data using field mappings
  for (const [fieldName, keywords] of Object.entries(FIELD_MAPPINGS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[\\s]*[:=]?[\\s]*([^\\n\\r,;]+)`, 'i');
      const match = allText.match(regex);
      if (match && match[1]) {
        const value = match[1].trim();
        if (value && value.length > 0) {
          extractedData[fieldName] = value;
          break;
        }
      }
    }
  }
  
  // Extract from email headers
  if (emailContent.from) {
    const fromMatch = emailContent.from.match(/^([^<]+)<([^>]+)>$/);
    if (fromMatch) {
      extractedData['sender_name'] = fromMatch[1].trim();
      extractedData['sender_email'] = fromMatch[2].trim();
    } else {
      extractedData['sender_email'] = emailContent.from;
    }
  }
  
  return extractedData;
}

/**
 * Get PDF form fields and their types
 */
async function getPdfFormFields(pdfBuffer) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    const formFields = [];
    
    for (const field of fields) {
      const fieldInfo = {
        name: field.getName(),
        type: field.constructor.name,
        required: field.isRequired(),
        readOnly: field.isReadOnly(),
        value: field.getValue(),
        // Try to infer field purpose from name
        inferredPurpose: inferFieldPurpose(field.getName())
      };
      
      formFields.push(fieldInfo);
    }
    
    return formFields;
  } catch (error) {
    console.error('Error reading PDF form fields:', error);
    throw new Error('Failed to read PDF form fields');
  }
}

/**
 * Infer field purpose from field name
 */
function inferFieldPurpose(fieldName) {
  const name = fieldName.toLowerCase();
  
  for (const [purpose, keywords] of Object.entries(FIELD_MAPPINGS)) {
    for (const keyword of keywords) {
      if (name.includes(keyword)) {
        return purpose;
      }
    }
  }
  
  return 'unknown';
}

/**
 * Match extracted data to PDF fields
 */
function matchDataToFields(extractedData, formFields) {
  const mappings = [];
  const unmatchedData = { ...extractedData };
  const unmatchedFields = [...formFields];
  
  // Direct name matches
  for (const field of formFields) {
    const fieldName = field.name.toLowerCase();
    
    for (const [dataKey, dataValue] of Object.entries(extractedData)) {
      if (fieldName.includes(dataKey) || dataKey.includes(fieldName)) {
        mappings.push({
          field: field,
          dataKey: dataKey,
          dataValue: dataValue,
          confidence: 'high',
          reason: 'Direct name match'
        });
        
        delete unmatchedData[dataKey];
        const fieldIndex = unmatchedFields.findIndex(f => f.name === field.name);
        if (fieldIndex !== -1) {
          unmatchedFields.splice(fieldIndex, 1);
        }
        break;
      }
    }
  }
  
  // Type-based matches
  for (const field of unmatchedFields) {
    const fieldPurpose = field.inferredPurpose;
    
    for (const [dataKey, dataValue] of Object.entries(unmatchedData)) {
      if (fieldPurpose === dataKey) {
        mappings.push({
          field: field,
          dataKey: dataKey,
          dataValue: dataValue,
          confidence: 'medium',
          reason: `Type-based match: ${fieldPurpose}`
        });
        
        delete unmatchedData[dataKey];
        const fieldIndex = unmatchedFields.findIndex(f => f.name === field.name);
        if (fieldIndex !== -1) {
          unmatchedFields.splice(fieldIndex, 1);
        }
        break;
      }
    }
  }
  
  return {
    mappings,
    unmatchedData,
    unmatchedFields
  };
}

/**
 * Fill PDF with matched data
 */
async function fillPdfWithData(pdfBuffer, mappings) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const form = pdfDoc.getForm();
    
    for (const mapping of mappings) {
      const field = form.getField(mapping.field.name);
      if (field) {
        try {
          field.setValue(mapping.dataValue);
        } catch (error) {
          console.warn(`Failed to set value for field ${mapping.field.name}:`, error);
        }
      }
    }
    
    // Update field appearances
    form.updateFieldAppearances();
    
    const filledPdfBytes = await pdfDoc.save();
    return filledPdfBytes;
  } catch (error) {
    console.error('Error filling PDF:', error);
    throw new Error('Failed to fill PDF with data');
  }
}

/**
 * Main cloud function to process email and fill PDF template
 */
export default async function processEmailToPdf(request) {
  try {
    if (!request.user) {
      throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Unauthorized');
    }
    
    const { emailData, pdfTemplateId, requireConfirmation = true } = request.params;
    
    if (!emailData || !pdfTemplateId) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Email data and PDF template ID are required');
    }
    
    // Get PDF template
    const templateQuery = new Parse.Query('contracts_Template');
    templateQuery.equalTo('objectId', pdfTemplateId);
    templateQuery.equalTo('CreatedBy', request.user);
    const template = await templateQuery.first({ useMasterKey: true });
    
    if (!template) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'PDF template not found');
    }
    
    // Download PDF template
    const pdfUrl = template.get('URL');
    if (!pdfUrl) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'PDF template file not found');
    }
    
    const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(pdfResponse.data);
    
    // Extract email content
    const emailContent = extractEmailContent(emailData);
    
    // Extract field values from email
    const extractedData = extractFieldValues(emailContent);
    
    // Get PDF form fields
    const formFields = await getPdfFormFields(pdfBuffer);
    
    // Match data to fields
    const matchingResult = matchDataToFields(extractedData, formFields);
    
    // If confirmation is required and there are unmatched fields/data, return for user confirmation
    if (requireConfirmation && (Object.keys(matchingResult.unmatchedData).length > 0 || matchingResult.unmatchedFields.length > 0)) {
      return {
        status: 'needs_confirmation',
        mappings: matchingResult.mappings,
        unmatchedData: matchingResult.unmatchedData,
        unmatchedFields: matchingResult.unmatchedFields,
        extractedData,
        formFields
      };
    }
    
    // Fill PDF with confirmed mappings
    const filledPdfBytes = await fillPdfWithData(pdfBuffer, matchingResult.mappings);
    
    // Save filled PDF
    const fileName = `filled_${Date.now()}.pdf`;
    const tempPath = `./exports/${fileName}`;
    fs.writeFileSync(tempPath, filledPdfBytes);
    
    // Upload to cloud storage
    const uploadResult = await uploadFile(fileName, tempPath);
    
    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    return {
      status: 'success',
      filledPdfUrl: uploadResult.imageUrl,
      mappings: matchingResult.mappings,
      unmatchedData: matchingResult.unmatchedData,
      unmatchedFields: matchingResult.unmatchedFields
    };
    
  } catch (error) {
    console.error('Error in processEmailToPdf:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
}

/**
 * Confirm mappings and fill PDF
 */
export async function confirmAndFillPdf(request) {
  try {
    if (!request.user) {
      throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Unauthorized');
    }
    
    const { pdfTemplateId, confirmedMappings, pdfBuffer } = request.params;
    
    if (!pdfTemplateId || !confirmedMappings) {
      throw new Parse.Error(Parse.Error.INVALID_QUERY, 'PDF template ID and confirmed mappings are required');
    }
    
    // Get PDF template
    const templateQuery = new Parse.Query('contracts_Template');
    templateQuery.equalTo('objectId', pdfTemplateId);
    templateQuery.equalTo('CreatedBy', request.user);
    const template = await templateQuery.first({ useMasterKey: true });
    
    if (!template) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'PDF template not found');
    }
    
    // Download PDF template if not provided
    let pdfBytes;
    if (pdfBuffer) {
      pdfBytes = Buffer.from(pdfBuffer, 'base64');
    } else {
      const pdfUrl = template.get('URL');
      const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
      pdfBytes = Buffer.from(pdfResponse.data);
    }
    
    // Fill PDF with confirmed mappings
    const filledPdfBytes = await fillPdfWithData(pdfBytes, confirmedMappings);
    
    // Save filled PDF
    const fileName = `filled_${Date.now()}.pdf`;
    const tempPath = `./exports/${fileName}`;
    fs.writeFileSync(tempPath, filledPdfBytes);
    
    // Upload to cloud storage
    const uploadResult = await uploadFile(fileName, tempPath);
    
    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    return {
      status: 'success',
      filledPdfUrl: uploadResult.imageUrl,
      mappings: confirmedMappings
    };
    
  } catch (error) {
    console.error('Error in confirmAndFillPdf:', error);
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, error.message);
  }
}
