'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFolder, FiPlus, FiRefreshCw, FiSearch, FiEdit3, FiTrash2, FiChevronRight, FiChevronDown, FiX, FiCheck, FiImage, FiGrid, FiBook, FiLayout, FiLayers, FiLoader } from 'react-icons/fi';
import { API_URL } from '@/config/api';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('tree');
  const [expandedParents, setExpandedParents] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      const data = json?.data || [];
      setCategories(data);
      const parents = data.filter(c => c.isParent).map(c => c._id);
      setExpandedParents(parents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter(cat => {
    const matchSearch = cat.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || cat.type === typeFilter;
    return matchSearch && matchType;
  });

  const parentCategories = categories.filter(c => c.isParent);

  const hierarchicalData = parentCategories
    .filter(p => typeFilter === 'all' || p.type === typeFilter)
    .filter(p => {
      const parentMatch = p.name?.toLowerCase().includes(search.toLowerCase());
      const childMatch = categories.some(c => c.parentCategory?._id === p._id && c.name?.toLowerCase().includes(search.toLowerCase()));
      return parentMatch || childMatch;
    })
    .map(parent => ({
      ...parent,
      children: categories.filter(c => c.parentCategory?._id === parent._id || c.parentCategory === parent._id)
    }));

  const toggleExpand = (id) => {
    setExpandedParents(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const stats = {
    total: categories.length,
    course: categories.filter(c => c.type === 'course').length,
    website: categories.filter(c => c.type === 'website').length,
    designTemplate: categories.filter(c => c.type === 'design-template').length,
    parents: parentCategories.length
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/categories/admin/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/categories/admin/${editData._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      setEditData(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const getTypeColor = (type) => {
    const colors = { course: 'bg-blue-500', website: 'bg-emerald-500', 'design-template': 'bg-violet-500' };
    return colors[type] || 'bg-gray-500';
  };

  const getTypeBadgeColor = (type) => {
    const colors = { course: 'bg-blue-50 text-blue-600', website: 'bg-emerald-50 text-emerald-600', 'design-template': 'bg-violet-50 text-violet-600' };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const getTypeIcon = (type) => {
    const icons = { course: <FiBook size={16} />, website: <FiLayout size={16} />, 'design-template': <FiLayers size={16} /> };
    return icons[type] || <FiFolder size={16} />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
            <FiFolder className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Categories</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your product taxonomy</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCategories} className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md transition-colors">
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/dashboard/admin/category/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors">
              <FiPlus size={16} /> New Category
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FiGrid, color: 'text-slate-600' },
          { label: 'Courses', value: stats.course, icon: FiBook, color: 'text-blue-500' },
          { label: 'Websites', value: stats.website, icon: FiLayout, color: 'text-emerald-500' },
          { label: 'Designs', value: stats.designTemplate, icon: FiLayers, color: 'text-violet-500' },
          { label: 'Root Groups', value: stats.parents, icon: FiFolder, color: 'text-amber-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={stat.color} size={18} />
              <span className="text-xl font-semibold text-slate-800 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Filter categories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'course', 'website', 'design-template'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-slate-800 dark:bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All' : type === 'design-template' ? 'Designs' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-900 rounded-md">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'tree' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Tree
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === 'flat' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <FiLoader className="animate-spin text-blue-500" size={32} />
          <p className="text-sm text-slate-500">Loading categories...</p>
        </div>
      ) : viewMode === 'tree' ? (
        <div className="space-y-3">
          {hierarchicalData.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
              <FiFolder size={48} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 dark:text-white">No Categories Found</h3>
              <p className="text-sm text-slate-500 mt-1">Create a category to get started.</p>
              <Link href="/dashboard/admin/category/create">
                <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md mx-auto">
                  <FiPlus size={16} /> Create Category
                </button>
              </Link>
            </div>
          ) : (
            hierarchicalData.map((parent) => (
              <div key={parent._id} className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleExpand(parent._id)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                      expandedParents.includes(parent._id) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {expandedParents.includes(parent._id) ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                  </button>
                  <div className={`w-10 h-10 rounded-md ${getTypeColor(parent.type)} flex items-center justify-center text-white overflow-hidden`}>
                    {parent.image ? <img src={parent.image} className="w-full h-full object-cover" alt="" /> : <FiFolder size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white">{parent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 ${getTypeBadgeColor(parent.type)} rounded text-xs`}>{parent.type}</span>
                      <span className="text-xs text-slate-400">{parent.children?.length || 0} sub-categories</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${parent.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {parent.status}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditData(parent)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                      <FiEdit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(parent._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {expandedParents.includes(parent._id) && parent.children?.length > 0 && (
                  <div className="bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
                    {parent.children.map((child, idx) => (
                      <div key={child._id} className={`flex items-center gap-3 py-3 px-4 pl-16 hover:bg-white dark:hover:bg-slate-800 transition-colors ${idx < parent.children.length - 1 ? 'border-b border-gray-100 dark:border-slate-700/50' : ''}`}>
                        <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                          {getTypeIcon(child.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{child.name}</p>
                          <p className="text-xs text-slate-400">/{child.slug}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${child.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {child.status}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => setEditData(child)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors">
                            <FiEdit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(child._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <FiSearch size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No categories match your search</p>
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat._id} className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-md ${getTypeColor(cat.type)} flex items-center justify-center text-white overflow-hidden`}>
                    {cat.image ? <img src={cat.image} className="w-full h-full object-cover" alt="" /> : (cat.isParent ? <FiFolder size={20} /> : getTypeIcon(cat.type))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white truncate">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className={`px-2 py-0.5 ${getTypeBadgeColor(cat.type)} rounded text-xs`}>{cat.type}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${cat.isParent ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.isParent ? 'Root' : 'Child'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${cat.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.status}
                  </span>
                </div>
                {cat.parentCategory && (
                  <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                    <FiChevronRight size={12} />
                    Under: {cat.parentCategory.name}
                  </p>
                )}
                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-slate-700">
                  <button onClick={() => setEditData(cat)} className="flex-1 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 p-4">
          <div className="bg-white dark:bg-slate-800 h-full w-full max-w-md rounded-md shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white ${getTypeColor(editData.type)}`}>
                  <FiEdit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-white">Edit Category</h3>
                  <p className="text-xs text-slate-500">{editData.isParent ? 'Root Category' : 'Sub-Category'}</p>
                </div>
              </div>
              <button onClick={() => setEditData(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-md transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-4 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Slug</label>
                <input
                  type="text"
                  value={editData.slug || ''}
                  onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-sm font-mono focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Image URL</label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={editData.image || ''}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors resize-none"
                  placeholder="Category description..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['course', 'website', 'design-template'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditData({ ...editData, type })}
                      className={`py-2 rounded-md text-xs font-medium transition-colors ${
                        editData.type === type
                          ? `${getTypeColor(type)} text-white`
                          : 'bg-gray-100 dark:bg-slate-700 text-slate-500 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'design-template' ? 'Design' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {!editData.isParent && (
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Parent Category</label>
                  <select
                    value={editData.parentCategory?._id || editData.parentCategory || ''}
                    onChange={(e) => setEditData({ ...editData, parentCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                  >
                    <option value="">No Parent (Root)</option>
                    {parentCategories
                      .filter(p => p.type === editData.type && p._id !== editData._id)
                      .map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-md">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</p>
                  <p className="text-xs text-slate-500">{editData.status === 'active' ? 'Visible to users' : 'Hidden'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditData({ ...editData, status: editData.status === 'active' ? 'inactive' : 'active' })}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center p-0.5 ${editData.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${editData.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <FiCheck size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
