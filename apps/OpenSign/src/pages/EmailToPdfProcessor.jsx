import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Parse from 'parse';
import ModalUi from '../primitives/ModalUi';
import Loader from '../primitives/Loader';
import Alert from '../primitives/Alert';
import Title from '../components/Title';
import EmailParser from '../components/EmailParser';
import { PDFDocument } from 'pdf-lib';

const EmailToPdfProcessor = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isShow: false, alertMessage: '' });
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    body: '',
    from: '',
    to: '',
    cc: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [parsedEmailData, setParsedEmailData] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedMappings, setConfirmedMappings] = useState([]);
  const [unmatchedData, setUnmatchedData] = useState({});
  const [unmatchedFields, setUnmatchedFields] = useState([]);
  const [filledPdfUrl, setFilledPdfUrl] = useState('');

  // Load user's templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const templateQuery = new Parse.Query('contracts_Template');
      templateQuery.equalTo('CreatedBy', Parse.User.current());
      templateQuery.descending('createdAt');
      const results = await templateQuery.find();
      
      const templateList = results.map(template => ({
        objectId: template.id,
        name: template.get('Name') || 'Untitled Template',
        description: template.get('Description') || '',
        url: template.get('URL')
      }));
      
      setTemplates(templateList);
    } catch (error) {
      console.error('Error loading templates:', error);
      setAlert({
        isShow: true,
        alertMessage: t('error-loading-templates')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailDataChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailDataExtracted = (parsedData) => {
    setParsedEmailData(parsedData);
    // Update the email data with parsed information
    setEmailData({
      subject: parsedData.subject || '',
      body: parsedData.body || '',
      from: parsedData.from || '',
      to: parsedData.to || '',
      cc: parsedData.cc || '',
      date: parsedData.date || new Date().toISOString().split('T')[0]
    });
  };

  const processEmail = async () => {
    if (!selectedTemplate) {
      setAlert({
        isShow: true,
        alertMessage: t('please-select-template')
      });
      return;
    }

    if (!emailData.subject && !emailData.body) {
      setAlert({
        isShow: true,
        alertMessage: t('please-enter-email-content')
      });
      return;
    }

    // Use parsed data if available, otherwise use manual input
    const dataToProcess = parsedEmailData ? {
      ...emailData,
      extractedData: parsedEmailData.extractedData
    } : emailData;

    try {
      setIsLoading(true);
      
      const result = await Parse.Cloud.run('processEmailToPdf', {
        emailData: dataToProcess,
        pdfTemplateId: selectedTemplate,
        requireConfirmation: true
      });

      if (result.status === 'needs_confirmation') {
        setProcessingResult(result);
        setConfirmedMappings(result.mappings);
        setUnmatchedData(result.unmatchedData);
        setUnmatchedFields(result.unmatchedFields);
        setShowConfirmationModal(true);
      } else if (result.status === 'success') {
        setFilledPdfUrl(result.filledPdfUrl);
        setAlert({
          isShow: true,
          alertMessage: t('pdf-filled-successfully')
        });
      }
    } catch (error) {
      console.error('Error processing email:', error);
      setAlert({
        isShow: true,
        alertMessage: error.message || t('error-processing-email')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingConfirmation = (mapping, isConfirmed) => {
    if (isConfirmed) {
      setConfirmedMappings(prev => [...prev, mapping]);
    }
  };

  const handleManualMapping = (fieldName, dataKey, dataValue) => {
    const mapping = {
      field: { name: fieldName },
      dataKey,
      dataValue,
      confidence: 'manual',
      reason: 'Manual mapping'
    };
    
    setConfirmedMappings(prev => [...prev, mapping]);
    
    // Remove from unmatched data/fields
    setUnmatchedData(prev => {
      const newData = { ...prev };
      delete newData[dataKey];
      return newData;
    });
    
    setUnmatchedFields(prev => prev.filter(field => field.name !== fieldName));
  };

  const confirmAndFillPdf = async () => {
    try {
      setIsLoading(true);
      
      const result = await Parse.Cloud.run('confirmAndFillPdf', {
        pdfTemplateId: selectedTemplate,
        confirmedMappings
      });

      if (result.status === 'success') {
        setFilledPdfUrl(result.filledPdfUrl);
        setShowConfirmationModal(false);
        setAlert({
          isShow: true,
          alertMessage: t('pdf-filled-successfully')
        });
      }
    } catch (error) {
      console.error('Error confirming mappings:', error);
      setAlert({
        isShow: true,
        alertMessage: error.message || t('error-filling-pdf')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFilledPdf = () => {
    if (filledPdfUrl) {
      const link = document.createElement('a');
      link.href = filledPdfUrl;
      link.download = `filled_${selectedTemplate}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setEmailData({
      subject: '',
      body: '',
      from: '',
      to: '',
      cc: '',
      date: new Date().toISOString().split('T')[0]
    });
    setSelectedTemplate('');
    setProcessingResult(null);
    setConfirmedMappings([]);
    setUnmatchedData({});
    setUnmatchedFields([]);
    setFilledPdfUrl('');
    setShowConfirmationModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Title title={t('email-to-pdf-processor')} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('email-to-pdf-processor')}</h2>
          <p className="text-gray-600 mb-6">
            {t('email-to-pdf-description')}
          </p>

          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('select-pdf-template')} *
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('choose-template')}</option>
              {templates.map(template => (
                <option key={template.objectId} value={template.objectId}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Email Parser Component */}
          <div className="mb-6">
            <EmailParser onEmailDataExtracted={handleEmailDataExtracted} />
          </div>

          {/* Manual Email Data Input (Fallback) */}
          <div className="mb-6">
            <details className="border border-gray-200 rounded-md">
              <summary className="px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100">
                {t('manual-email-input')}
              </summary>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('email-subject')}
                    </label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) => handleEmailDataChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enter-email-subject')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('from')}
                    </label>
                    <input
                      type="email"
                      value={emailData.from}
                      onChange={(e) => handleEmailDataChange('from', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="sender@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('to')}
                    </label>
                    <input
                      type="email"
                      value={emailData.to}
                      onChange={(e) => handleEmailDataChange('to', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="recipient@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('date')}
                    </label>
                    <input
                      type="date"
                      value={emailData.date}
                      onChange={(e) => handleEmailDataChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email-body')} *
                  </label>
                  <textarea
                    value={emailData.body}
                    onChange={(e) => handleEmailDataChange('body', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('enter-email-body')}
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={processEmail}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader /> : t('process-email')}
            </button>
            
            {filledPdfUrl && (
              <button
                onClick={downloadFilledPdf}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {t('download-filled-pdf')}
              </button>
            )}
            
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              {t('reset')}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ModalUi
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          title={t('confirm-field-mappings')}
          size="lg"
        >
          <div className="space-y-6">
            {/* Automatic Mappings */}
            {confirmedMappings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">{t('automatic-mappings')}</h3>
                <div className="space-y-2">
                  {confirmedMappings.map((mapping, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div>
                        <span className="font-medium">{mapping.field.name}</span>
                        <span className="mx-2">→</span>
                        <span className="text-green-700">{mapping.dataValue}</span>
                      </div>
                      <span className="text-xs text-gray-500">{mapping.confidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unmatched Data */}
            {Object.keys(unmatchedData).length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">{t('unmatched-data')}</h3>
                <div className="space-y-2">
                  {Object.entries(unmatchedData).map(([key, value]) => (
                    <div key={key} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="font-medium text-yellow-800">{key}</div>
                      <div className="text-yellow-700">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unmatched Fields */}
            {unmatchedFields.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">{t('unmatched-fields')}</h3>
                <div className="space-y-2">
                  {unmatchedFields.map((field, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="font-medium text-blue-800">{field.name}</div>
                      <div className="text-sm text-blue-600">{field.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Mapping Section */}
            {Object.keys(unmatchedData).length > 0 && unmatchedFields.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">{t('manual-mapping')}</h3>
                <div className="space-y-4">
                  {Object.entries(unmatchedData).map(([dataKey, dataValue]) => (
                    <div key={dataKey} className="p-4 border border-gray-200 rounded-md">
                      <div className="font-medium mb-2">{dataKey}: {dataValue}</div>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleManualMapping(e.target.value, dataKey, dataValue);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('select-field')}</option>
                        {unmatchedFields.map((field, index) => (
                          <option key={index} value={field.name}>
                            {field.name} ({field.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmAndFillPdf}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader /> : t('fill-pdf')}
              </button>
            </div>
          </div>
        </ModalUi>

        {/* Alert */}
        {alert.isShow && (
          <Alert
            isShow={alert.isShow}
            alertMessage={alert.alertMessage}
            setIsAlert={setAlert}
          />
        )}
      </div>
    </div>
  );
};

export default EmailToPdfProcessor;
