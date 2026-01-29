'use client';

import React, { useState } from 'react';
import { FiSearch, FiPlus, FiTrash2, FiEye, FiDownload, FiImage, FiFilter, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function ImagesPage() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const images = [
    {
      id: 1,
      name: 'Course Banner 1',
      category: 'Course Banner',
      fileName: 'course-banner-1.jpg',
      size: '2.4 MB',
      uploadDate: 'Dec 10, 2024',
      usedIn: 'Web Development Course',
      status: 'Active',
      color: '#FF6B6B',
    },
    {
      id: 2,
      name: 'Mentor Profile - John',
      category: 'Mentor Profile',
      fileName: 'mentor-john.jpg',
      size: '1.8 MB',
      uploadDate: 'Dec 08, 2024',
      usedIn: 'John Doe Profile',
      status: 'Active',
      color: '#4ECDC4',
    },
    {
      id: 3,
      name: 'About Gallery Image',
      category: 'Gallery',
      fileName: 'gallery-about-1.jpg',
      size: '3.2 MB',
      uploadDate: 'Dec 05, 2024',
      usedIn: 'About Page Gallery',
      status: 'Active',
      color: '#45B7D1',
    },
    {
      id: 4,
      name: 'Partner Logo',
      category: 'Logo',
      fileName: 'partner-logo.png',
      size: '0.8 MB',
      uploadDate: 'Nov 30, 2024',
      usedIn: 'Partners Section',
      status: 'Active',
      color: '#FFA07A',
    },
    {
      id: 5,
      name: 'Success Story Image',
      category: 'Success Story',
      fileName: 'success-story-5.jpg',
      size: '2.6 MB',
      uploadDate: 'Nov 25, 2024',
      usedIn: 'Success Stories Page',
      status: 'Inactive',
      color: '#98D8C8',
    },
  ];

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';
      case 'Inactive':
        return 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
      default:
        return 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const getCategoryStyle = (category) => {
    const styles = {
      'Course Banner': 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
      'Mentor Profile': 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
      'Gallery': 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
      'Logo': 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400',
      'Success Story': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    };
    return styles[category] || 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
  };

  const stats = {
    total: images.length,
    storage: '128 MB',
    active: images.filter(img => img.status === 'Active').length,
    unused: images.filter(img => img.status === 'Inactive').length,
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-md ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <FiImage className="text-blue-500" size={20} />
          </div>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Images
          </h1>
        </div>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Manage and organize course and content images
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Images</p>
          <p className={`text-2xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Storage Used</p>
          <p className="text-2xl font-semibold mt-1 text-orange-500">{stats.storage}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Active</p>
          <p className="text-2xl font-semibold mt-1 text-green-500">{stats.active}</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Unused</p>
          <p className="text-2xl font-semibold mt-1 text-red-500">{stats.unused}</p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} size={16} />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        <div className="flex gap-2">
          <button className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${
            isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>
            <FiFilter size={16} />
            <span>Category</span>
            <FiChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md">
            <FiPlus size={16} />
            <span>Upload Image</span>
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
                  Image
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  File Info
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Category
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Used In
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  Uploaded
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
              {filteredImages.map((image) => (
                <tr key={image.id} className={isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: image.color }}
                      >
                        <FiImage size={16} />
                      </div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{image.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-900'}`}>{image.fileName}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{image.size}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryStyle(image.category)}`}>
                      {image.category}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {image.usedIn}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {image.uploadDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusStyle(image.status)}`}>
                      {image.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}>
                        <FiEye size={16} />
                      </button>
                      <button className={`p-1.5 rounded-md ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-orange-400' : 'hover:bg-gray-100 text-gray-400 hover:text-orange-500'}`}>
                        <FiDownload size={16} />
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
            Showing {filteredImages.length} of {images.length} images
          </p>
        </div>
      </div>
    </div>
  );
}
