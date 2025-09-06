import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  AlertTriangle, 
  Zap, 
  CheckCircle,
  Eye,
  ExternalLink,
  Loader
} from 'lucide-react';

interface AnalysisResults {
  id: string;
  filename: string;
  originalText: string;
  plagiarismScore: number;
  aiScore: number;
  humanScore: number;
  analysisDate: string;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    similarity: number;
    excerpt: string;
  }>;
  aiSegments: Array<{
    text: string;
    confidence: number;
    startIndex: number;
    endIndex: number;
  }>;
  plagiarizedSegments: Array<{
    text: string;
    sourceId: string;
    startIndex: number;
    endIndex: number;
  }>;
}

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plagiarism' | 'ai' | 'sources'>('overview');

  useEffect(() => {
    // Simulate API call to fetch results
    const fetchResults = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockResults: AnalysisResults = {
        id: id || '1',
        filename: 'Research Paper Draft.docx',
        originalText: `Artificial intelligence has revolutionized many aspects of modern life, from healthcare to transportation. Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions with remarkable accuracy. The integration of AI in various industries has led to increased efficiency and innovation. However, concerns about job displacement and ethical considerations surrounding AI development continue to be debated by experts and policymakers. As we move forward, it is crucial to balance the benefits of AI advancement with responsible implementation and consideration of its societal impact. The future of artificial intelligence holds tremendous potential for solving complex global challenges while requiring careful oversight and regulation.`,
        plagiarismScore: 23,
        aiScore: 67,
        humanScore: 33,
        analysisDate: '2025-01-15',
        sources: [
          {
            id: '1',
            title: 'The Impact of Artificial Intelligence on Modern Society',
            url: 'https://example.com/ai-impact-society',
            similarity: 85,
            excerpt: 'Artificial intelligence has revolutionized many aspects of modern life, from healthcare to transportation systems...'
          },
          {
            id: '2',
            title: 'Machine Learning Applications in Industry',
            url: 'https://example.com/ml-industry',
            similarity: 72,
            excerpt: 'Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions...'
          }
        ],
        aiSegments: [
          {
            text: 'The integration of AI in various industries has led to increased efficiency and innovation.',
            confidence: 89,
            startIndex: 200,
            endIndex: 287
          },
          {
            text: 'As we move forward, it is crucial to balance the benefits of AI advancement with responsible implementation',
            confidence: 92,
            startIndex: 450,
            endIndex: 547
          }
        ],
        plagiarizedSegments: [
          {
            text: 'Artificial intelligence has revolutionized many aspects of modern life, from healthcare to transportation',
            sourceId: '1',
            startIndex: 0,
            endIndex: 97
          },
          {
            text: 'Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions',
            sourceId: '2',
            startIndex: 99,
            endIndex: 197
          }
        ]
      };
      
      setResults(mockResults);
      setLoading(false);
    };

    fetchResults();
  }, [id]);

  const getHighlightedText = (text: string) => {
    if (!results) return text;
    
    const segments = [];
    let lastIndex = 0;
    
    // Combine all segments and sort by start index
    const allSegments = [
      ...results.plagiarizedSegments.map(seg => ({ ...seg, type: 'plagiarism' })),
      ...results.aiSegments.map(seg => ({ ...seg, type: 'ai' }))
    ].sort((a, b) => a.startIndex - b.startIndex);
    
    allSegments.forEach(segment => {
      // Add text before the segment
      if (segment.startIndex > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`} className="text-gray-900">
            {text.slice(lastIndex, segment.startIndex)}
          </span>
        );
      }
      
      // Add the highlighted segment
      const className = segment.type === 'plagiarism' 
        ? 'bg-red-200 text-red-900 px-1 py-0.5 rounded'
        : 'bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded';
      
      segments.push(
        <span key={`${segment.type}-${segment.startIndex}`} className={className}>
          {text.slice(segment.startIndex, segment.endIndex)}
        </span>
      );
      
      lastIndex = segment.endIndex;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-${lastIndex}`} className="text-gray-900">
          {text.slice(lastIndex)}
        </span>
      );
    }
    
    return segments;
  };

  const getScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-600 bg-green-50 border-green-200';
    if (score <= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const downloadReport = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    element.href = '#';
    element.download = `analysis-report-${results?.id}.pdf`;
    element.click();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Analyzing Content</h2>
          <p className="text-gray-600">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Analysis Not Found</h2>
          <p className="text-gray-600 mb-4">The requested analysis could not be found.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <Link
            to="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{results.filename}</h1>
            <p className="text-gray-600">Analysis completed on {results.analysisDate}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadReport}
            className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Eye className="h-4 w-4" />
            <span>View Report</span>
          </button>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-2xl border-2 ${getScoreColor(results.plagiarismScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-2xl font-bold">{results.plagiarismScore}%</span>
          </div>
          <h3 className="font-semibold">Plagiarism Detected</h3>
          <p className="text-sm opacity-80">Content matching existing sources</p>
        </div>

        <div className={`p-6 rounded-2xl border-2 ${getScoreColor(results.aiScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-6 w-6" />
            <span className="text-2xl font-bold">{results.aiScore}%</span>
          </div>
          <h3 className="font-semibold">AI-Generated</h3>
          <p className="text-sm opacity-80">Likely machine-generated content</p>
        </div>

        <div className="p-6 rounded-2xl border-2 text-green-600 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-6 w-6" />
            <span className="text-2xl font-bold">{results.humanScore}%</span>
          </div>
          <h3 className="font-semibold">Human Written</h3>
          <p className="text-sm opacity-80">Original human-authored content</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'overview', label: 'Overview', icon: FileText },
              { key: 'plagiarism', label: 'Plagiarism Analysis', icon: AlertTriangle },
              { key: 'ai', label: 'AI Detection', icon: Zap },
              { key: 'sources', label: 'Sources', icon: ExternalLink }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Content</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm leading-relaxed">
                  {getHighlightedText(results.originalText)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-200 rounded"></div>
                      <span className="text-sm text-gray-600">Plagiarized content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                      <span className="text-sm text-gray-600">AI-generated content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-white border rounded"></div>
                      <span className="text-sm text-gray-600">Original content</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• {results.plagiarizedSegments.length} plagiarized segments found</p>
                    <p>• {results.aiSegments.length} AI-generated segments detected</p>
                    <p>• {results.sources.length} sources identified</p>
                    <p>• Analysis completed in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plagiarism' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plagiarized Segments</h3>
                <div className="space-y-4">
                  {results.plagiarizedSegments.map((segment, index) => {
                    const source = results.sources.find(s => s.id === segment.sourceId);
                    return (
                      <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-red-900 font-medium mb-2">"{segment.text}"</p>
                            {source && (
                              <div className="space-y-1">
                                <p className="text-sm text-red-700">
                                  <span className="font-medium">Source:</span> {source.title}
                                </p>
                                <p className="text-sm text-red-600">
                                  <span className="font-medium">Similarity:</span> {source.similarity}%
                                </p>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                                >
                                  <span>View source</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Segments</h3>
                <div className="space-y-4">
                  {results.aiSegments.map((segment, index) => (
                    <div key={index} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Zap className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-yellow-900 font-medium mb-2">"{segment.text}"</p>
                          <p className="text-sm text-yellow-700">
                            <span className="font-medium">AI Confidence:</span> {segment.confidence}%
                          </p>
                          <div className="mt-2">
                            <div className="w-full bg-yellow-200 rounded-full h-2">
                              <div
                                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${segment.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Identified Sources</h3>
                <div className="space-y-4">
                  {results.sources.map((source) => (
                    <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{source.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">"{source.excerpt}"</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">
                              <span className="font-medium">Similarity:</span> {source.similarity}%
                            </span>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                            >
                              <span>Visit source</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(source.similarity)}`}>
                            {source.similarity}% match
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;