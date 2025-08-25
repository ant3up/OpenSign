# Email to PDF Processor

## Overview

The Email to PDF Processor is a powerful feature that automatically extracts data from emails and intelligently maps it to PDF form fields. This tool is designed to handle emails that don't follow a particular format, making it perfect for processing various types of email communications and automatically filling PDF templates.

## Features

### 🧠 Intelligent Data Extraction
- **Pattern Recognition**: Automatically identifies common data patterns like names, emails, phone numbers, dates, amounts, etc.
- **Structured Field Mapping**: Maps extracted data to appropriate PDF form fields based on field names and types
- **Email Header Parsing**: Extracts sender information, dates, and other metadata from email headers

### 🔍 Smart Field Matching
- **Direct Name Matching**: Matches field names directly (e.g., "name" field matches "name" data)
- **Type-based Matching**: Uses field type inference to match data (e.g., email data to email fields)
- **Confidence Scoring**: Provides confidence levels for each mapping (high, medium, manual)

### 🛡️ User Confirmation System
- **No Guessing Policy**: When the system is unsure about a mapping, it stops and asks for user clarification
- **Manual Mapping Interface**: Allows users to manually map unmatched data to unmatched fields
- **Visual Feedback**: Clear display of automatic mappings, unmatched data, and unmatched fields

### 📧 Multiple Email Input Methods
- **File Upload**: Support for .txt and .eml files
- **Text Pasting**: Direct pasting of email content
- **Manual Input**: Fallback option for manual data entry

## How to Use

### 1. Access the Feature
- Navigate to the "Email to PDF" option in the main menu
- The feature is available to all authenticated users

### 2. Select a PDF Template
- Choose from your existing PDF templates
- The template must contain form fields to be filled

### 3. Input Email Data
You have three options for providing email data:

#### Option A: Upload Email File
- Click "Choose File" and select a .txt or .eml file
- The system will automatically parse the email content

#### Option B: Paste Email Content
- Copy the email content (including headers)
- Paste it into the text area
- Click "Parse Email" to extract structured data

#### Option C: Manual Input
- Expand the "Manual Email Input" section
- Fill in the email fields manually

### 4. Process the Email
- Click "Process Email" to analyze the data and match it to PDF fields
- The system will show you the results and ask for confirmation if needed

### 5. Review and Confirm Mappings
The system will display:

#### ✅ Automatic Mappings
- Fields that were successfully matched automatically
- Confidence level for each mapping
- Green background indicates high confidence

#### ⚠️ Unmatched Data
- Data extracted from the email that couldn't be mapped to any field
- Yellow background for visibility

#### 🔵 Unmatched Fields
- PDF form fields that don't have corresponding data
- Blue background for identification

### 6. Manual Mapping (if needed)
If there are unmatched data and fields:
- Select the appropriate field for each piece of data
- The system will create manual mappings
- All mappings will be used when filling the PDF

### 7. Fill and Download
- Click "Fill PDF" to generate the filled document
- Download the completed PDF

## Supported Data Types

The system can extract and map the following types of data:

### Personal Information
- Names (full name, first name, last name)
- Email addresses
- Phone numbers
- Job titles

### Address Information
- Street addresses
- Cities
- States/Provinces
- ZIP/Postal codes
- Countries

### Business Information
- Company names
- Departments
- Reference numbers
- Invoice numbers

### Financial Information
- Amounts (with currency symbols)
- Account numbers
- Due dates

### Dates
- Various date formats (MM/DD/YYYY, YYYY-MM-DD, etc.)
- Due dates
- Start/end dates

## Email Format Support

The system can parse emails in various formats:

### Standard Email Headers
```
From: sender@example.com
To: recipient@example.com
Subject: Email Subject
Date: Mon, 01 Jan 2024 12:00:00 +0000
```

### Structured Email Content
```
Name: John Doe
Company: ABC Corp
Phone: (555) 123-4567
Amount: $1,000.00
Due Date: 01/31/2024
```

### Free-form Email Content
The system can extract data from natural language:
- "Please process the invoice for $500.00"
- "Contact John Smith at john@example.com"
- "Due date is January 31st, 2024"

## Best Practices

### For Email Content
1. **Include Headers**: When pasting email content, include the email headers for better parsing
2. **Use Clear Labels**: Use descriptive labels like "Name:", "Amount:", "Due Date:" for better extraction
3. **Consistent Formatting**: Maintain consistent formatting throughout the email

### For PDF Templates
1. **Descriptive Field Names**: Use clear, descriptive field names (e.g., "customer_name" instead of "field1")
2. **Appropriate Field Types**: Use the correct field type for the data (text, email, date, etc.)
3. **Required Fields**: Mark important fields as required to ensure they get filled

### For Manual Mapping
1. **Review All Mappings**: Always review automatic mappings before confirming
2. **Use Manual Mapping**: When in doubt, use the manual mapping feature
3. **Test with Sample Data**: Test the process with sample emails before processing important documents

## Troubleshooting

### Common Issues

#### No Data Extracted
- **Cause**: Email format not recognized
- **Solution**: Try the manual input option or reformat the email

#### Too Many Unmatched Fields
- **Cause**: PDF template has more fields than available data
- **Solution**: Review the PDF template and consider adding default values

#### Incorrect Mappings
- **Cause**: Field names are ambiguous
- **Solution**: Rename PDF fields to be more descriptive

#### Processing Errors
- **Cause**: Invalid PDF template or corrupted file
- **Solution**: Check the PDF template and ensure it has valid form fields

### Getting Help
- Check the field mapping confirmation screen for detailed information
- Use the manual mapping feature for complex cases
- Contact support if you encounter persistent issues

## Technical Details

### Backend Processing
- **Email Parsing**: Uses regex patterns and structured parsing
- **Field Detection**: Analyzes PDF form fields using pdf-lib
- **Data Matching**: Implements fuzzy matching and type inference
- **PDF Filling**: Uses pdf-lib for form field population

### Security
- All processing happens on the server
- User authentication required
- Data is not stored permanently
- Secure file handling

### Performance
- Optimized for emails up to 10MB
- Supports PDFs up to 50MB
- Processing time typically under 30 seconds

## Future Enhancements

Planned improvements include:
- Machine learning-based field matching
- Support for more email formats
- Batch processing capabilities
- Integration with email clients
- Advanced data validation
- Template learning from user corrections

---

For technical support or feature requests, please contact the development team.

