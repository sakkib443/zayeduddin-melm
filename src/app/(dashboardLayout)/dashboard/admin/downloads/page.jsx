'use client';
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { FiDownload, FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/downloads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDownloads(data.data || []);
    } catch (err) {
      console.error('Error fetching downloads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDownloads(); }, []);

  const filteredDownloads = downloads.filter(dl =>
    dl.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dl.product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDownloads.length / itemsPerPage);
  const paginatedDownloads = filteredDownloads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-500 rounded-md flex items-center justify-center">
            <FiDownload className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Downloads</h1>
            <p className="text-sm text-slate-500">Track product downloads</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md text-sm font-medium">
          {downloads.length} total
        </span>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search downloads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 outline-none text-sm transition-colors"
          />
        </div>
        <button
          onClick={fetchDownloads}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-colors"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Downloaded At</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <FiRefreshCw className="animate-spin mx-auto mb-2 text-violet-500" size={24} />
                    <p className="text-sm text-slate-500">Loading downloads...</p>
                  </td>
                </tr>
              ) : paginatedDownloads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <FiDownload size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No downloads found</p>
                  </td>
                </tr>
              ) : (
                paginatedDownloads.map((dl) => (
                  <tr key={dl._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-medium">
                          {dl.user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{dl.user?.firstName} {dl.user?.lastName}</p>
                          <p className="text-xs text-slate-400">{dl.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{dl.product?.title || dl.website?.title || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        dl.productType === 'website' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {dl.productType || 'website'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <FiCalendar size={12} />
                        {dl.downloadedAt ? new Date(dl.downloadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <FiDownload size={12} />
                        {dl.downloadCount || 1}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredDownloads.length)} of {filteredDownloads.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="px-2 text-sm text-slate-600">{currentPage}/{totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 dark:border-slate-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

