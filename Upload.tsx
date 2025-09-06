import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  FileText, 
  File, 
  X, 
  Loader, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Upload: React.FC = () => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const [textContent, setTextContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const supportedFormats = ['txt', 'pdf', 'docx'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setError('');
    const validFiles = newFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return extension && supportedFormats.includes(extension);
    });

    if (validFiles.length !== newFiles.length) {
      setError('Some files were rejected. Only TXT, PDF, and DOCX files are supported.');
    }

    setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Limit to 5 files
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-600" />;
      case 'docx':
        return <File className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleAnalysis = async () => {
    if (uploadMethod === 'text' && !textContent.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    
    if (uploadMethod === 'file' && files.length === 0) {
      setError('Please select at least one file to analyze');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Simulate upload and analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Navigate to results page with mock ID
      const analysisId = Math.random().toString(36).substr(2, 9);
      navigate(`/results/${analysisId}`);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Analysis</h1>
        <p className="text-xl text-gray-600">
          Upload your documents or paste text for plagiarism and AI content detection
        </p>
      </div>

      {/* Upload Method Toggle */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setUploadMethod('file')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'file'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <UploadIcon className="h-4 w-4" />
                <span>Upload Files</span>
              </div>
            </button>
            <button
              onClick={() => setUploadMethod('text')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'text'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Paste Text</span>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {uploadMethod === 'file' ? (
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".txt,.pdf,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-500 mb-4">
                Support for TXT, PDF, and DOCX files (max 5 files)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {supportedFormats.map(format => (
                  <span
                    key={format}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                  >
                    .{format.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-900">Selected Files</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your text content here for analysis..."
              rows={12}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{textContent.length} characters</span>
              <span>Minimum 100 characters recommended</span>
            </div>
          </div>
        )}

        {/* Analysis Options */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Analysis Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Plagiarism Detection</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">AI Content Detection</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Generate PDF Report</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Detailed Source Analysis</span>
            </label>
          </div>
        </div>

        {/* Start Analysis Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleAnalysis}
            disabled={uploading || (uploadMethod === 'file' && files.length === 0) || (uploadMethod === 'text' && !textContent.trim())}
            className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Analyzing Content...</span>
              </>
            ) : (
              <>
                <UploadIcon className="h-5 w-5" />
                <span>Start Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;