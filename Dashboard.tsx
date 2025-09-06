import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const recentReports = [
    {
      id: '1',
      filename: 'Research Paper Draft.docx',
      plagiarismScore: 15,
      aiScore: 23,
      humanScore: 77,
      uploadDate: '2025-01-15',
      status: 'completed'
    },
    {
      id: '2',
      filename: 'Essay on Climate Change.pdf',
      plagiarismScore: 8,
      aiScore: 67,
      humanScore: 33,
      uploadDate: '2025-01-14',
      status: 'completed'
    },
    {
      id: '3',
      filename: 'Marketing Content.txt',
      plagiarismScore: 32,
      aiScore: 89,
      humanScore: 11,
      uploadDate: '2025-01-13',
      status: 'completed'
    },
    {
      id: '4',
      filename: 'Thesis Chapter 3.docx',
      plagiarismScore: 5,
      aiScore: 12,
      humanScore: 88,
      uploadDate: '2025-01-12',
      status: 'processing'
    }
  ];

  const stats = {
    totalDocuments: 24,
    avgPlagiarism: 12.5,
    avgAiContent: 34.2,
    thisMonth: 8
  };

  const getScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-600 bg-green-50';
    if (score <= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'processing') return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your content analysis</p>
        </div>
        <Link
          to="/upload"
          className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Upload className="h-5 w-5" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</h3>
          <p className="text-gray-600 text-sm">Total Documents</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs text-gray-500">AVG</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.avgPlagiarism}%</h3>
          <p className="text-gray-600 text-sm">Avg Plagiarism</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">AVG</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.avgAiContent}%</h3>
          <p className="text-gray-600 text-sm">Avg AI Content</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600">+{stats.thisMonth}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.thisMonth}</h3>
          <p className="text-gray-600 text-sm">This Month</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          <p className="text-gray-600 text-sm mt-1">Your latest content analysis results</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plagiarism
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Human Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.filename}</div>
                      <div className="text-sm text-gray-500">{report.uploadDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(report.plagiarismScore)}`}>
                      {report.plagiarismScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(report.aiScore)}`}>
                      {report.aiScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-50">
                      {report.humanScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span className="text-sm text-gray-600 capitalize">{report.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/results/${report.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      {report.status === 'completed' && (
                        <button className="text-green-600 hover:text-green-900 flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/upload"
          className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-6 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <p className="text-blue-100 text-sm">Analyze new content for plagiarism and AI</p>
            </div>
          </div>
        </Link>

        <div className="bg-white hover:bg-gray-50 border rounded-2xl p-6 transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">View Analytics</h3>
              <p className="text-gray-600 text-sm">Detailed statistics and trends</p>
            </div>
          </div>
        </div>

        <div className="bg-white hover:bg-gray-50 border rounded-2xl p-6 transition-colors cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
              <p className="text-gray-600 text-sm">Download detailed analysis reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;