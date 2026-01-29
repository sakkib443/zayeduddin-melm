'use client';

import React, { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiDownload, FiAward } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function CertificationsPage() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const certifications = [
    {
      id: 1,
      title: 'Web Development Professional',
      code: 'WEB-PRO-001',
      course: 'Web Development Mastery',
      students: 18,
      issueDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'Active',
      validity: '2 years',
    },
    {
      id: 2,
      title: 'Digital Marketing Expert',
      code: 'DM-EXP-002',
      course: 'Digital Marketing Pro',
      students: 12,
      issueDate: '2024-02-20',
      expiryDate: '2025-02-20',
      status: 'Expiring Soon',
      validity: '1 year',
    },
    {
      id: 3,
      title: 'UI/UX Design Master',
      code: 'UIUX-MAE-003',
      course: 'UI/UX Design Advanced',
      students: 9,
      issueDate: '2024-03-10',
      expiryDate: '2027-03-10',
      status: 'Active',
      validity: '3 years',
    },
    {
      id: 4,
      title: 'Python Data Science',
      code: 'PDS-001-004',
      course: 'Python Data Science',
      students: 24,
      issueDate: '2023-12-01',
      expiryDate: '2025-12-01',
      status: 'Expired',
      validity: '2 years',
    },
    {
      id: 5,
      title: 'Business Analytics Pro',
      code: 'BA-PRO-005',
      course: 'Business Analytics',
      students: 7,
      issueDate: '2024-04-05',
      expiryDate: '2026-04-05',
      status: 'Active',
      validity: '2 years',
    },
  ];

  const filteredCertifications = certifications.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';
      case 'Expiring Soon':
        return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'Expired':
        return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const stats = {
    total: certifications.length,
    active: certifications.filter(c => c.status === 'Active').length,
    expiringSoon: certifications.filter(c => c.status === 'Expiring Soon').length,
    expired: certifications.filter(c => c.status === 'Expired').length,
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-md ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <FiAward className="text-orange-500" size={20} />
          </div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Certifications
          </h1>
        </div>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Manage certification programs and credentials
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total</p>
          <p className={`text-2xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Active</p>
          <p className="text-2xl font-semibold mt-1 text-green-500">{stats.active}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Expiring Soon</p>
          <p className="text-2xl font-semibold mt-1 text-yellow-500">{stats.expiringSoon}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Expired</p>
          <p className="text-2xl font-semibold mt-1 text-red-500">{stats.expired}</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-orange-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <div className="flex gap-2">
          <button className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${
            isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
            <FiDownload size={16} />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md">
            <FiPlus size={16} />
            <span>New Certificate</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'bg-slate-700/50' : 'bg-gray-50'}>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Certificate Title
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Code
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Course
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Issued
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Expires
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-100'}`}>
              {filteredCertifications.map((cert) => (
                <tr key={cert.id} className={isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{cert.title}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {cert.students} students issued
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
                      {cert.code}
                    </code>
                  </td>
                  <td className={`px-4 py-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {cert.course}
                  </td>
                  <td className={`px-4 py-3 text-center ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {cert.issueDate}
                  </td>
                  <td className={`px-4 py-3 text-center ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {cert.expiryDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusStyle(cert.status)}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}>
                        <FiEye size={16} />
                      </button>
                      <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-orange-400' : 'hover:bg-gray-100 text-gray-400 hover:text-orange-500'}`}>
                        <FiEdit2 size={16} />
                      </button>
                      <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700 bg-slate-700/30' : 'border-gray-100 bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Showing {filteredCertifications.length} of {certifications.length} certifications
          </p>
        </div>
      </div>
    </div>
  );
}
