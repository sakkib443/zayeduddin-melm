"use client";
import { API_URL } from '@/config/api';
import React, { useState, useEffect } from 'react';
import { FiTag, FiPercent, FiPlus, FiEdit3, FiTrash2, FiSearch, FiCalendar, FiUsers, FiCopy, FiRefreshCw, FiX, FiCheck } from 'react-icons/fi';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: '',
    minPurchase: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    usageLimit: '',
    usagePerUser: 1,
    applicableTo: 'all',
    isActive: true
  });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/coupons`);
      const data = await res.json();
      if (data.success) setCoupons(data.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCoupon ? `${API_URL}/coupons/${editingCoupon._id}` : `${API_URL}/coupons`;
      const res = await fetch(url, {
        method: editingCoupon ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: Number(formData.discountValue),
          maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
          minPurchase: Number(formData.minPurchase) || 0,
          usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
          usagePerUser: Number(formData.usagePerUser) || 1
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
        closeModal();
      } else {
        alert(data.message || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`${API_URL}/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || '',
      minPurchase: coupon.minPurchase || 0,
      startDate: coupon.startDate?.split('T')[0] || '',
      endDate: coupon.endDate?.split('T')[0] || '',
      usageLimit: coupon.usageLimit || '',
      usagePerUser: coupon.usagePerUser || 1,
      applicableTo: coupon.applicableTo || 'all',
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '', name: '', description: '', discountType: 'percentage', discountValue: 10,
      maxDiscount: '', minPurchase: 0, startDate: new Date().toISOString().split('T')[0],
      endDate: '', usageLimit: '', usagePerUser: 1, applicableTo: 'all', isActive: true
    });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied!');
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData(prev => ({ ...prev, code }));
  };

  const filteredCoupons = coupons.filter(c =>
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpired = (endDate) => new Date(endDate) < new Date();

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.isActive && !isExpired(c.endDate)).length,
    expired: coupons.filter(c => isExpired(c.endDate)).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center">
            <FiTag className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Coupons</h1>
            <p className="text-sm text-slate-500">Manage discount codes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCoupons} className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md transition-colors">
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors">
            <FiPlus size={16} /> New Coupon
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FiTag, color: 'text-slate-600' },
          { label: 'Active', value: stats.active, icon: FiCheck, color: 'text-emerald-500' },
          { label: 'Expired', value: stats.expired, icon: FiX, color: 'text-red-500' }
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

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none text-sm transition-colors"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <FiRefreshCw className="animate-spin text-orange-500" size={32} />
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
          <FiTag size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No coupons found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <div key={coupon._id} className="bg-white dark:bg-slate-800 p-4 rounded-md border border-gray-200 dark:border-slate-700 hover:border-orange-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-orange-500 flex items-center justify-center text-white">
                    {coupon.discountType === 'percentage' ? <FiPercent size={18} /> : <FiTag size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-slate-800 dark:text-white">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code)} className="text-slate-400 hover:text-orange-500">
                        <FiCopy size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">{coupon.name}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  !coupon.isActive ? 'bg-gray-100 text-gray-500' :
                  isExpired(coupon.endDate) ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {!coupon.isActive ? 'Inactive' : isExpired(coupon.endDate) ? 'Expired' : 'Active'}
                </span>
              </div>

              <div className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} OFF`}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                {coupon.minPurchase > 0 && <p>Min. Purchase: ৳{coupon.minPurchase}</p>}
                {coupon.maxDiscount && <p>Max Discount: ৳{coupon.maxDiscount}</p>}
                <p className="flex items-center gap-1"><FiCalendar size={12} /> Valid till: {new Date(coupon.endDate).toLocaleDateString()}</p>
                <p className="flex items-center gap-1"><FiUsers size={12} /> Used: {coupon.usedCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}</p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-slate-700">
                <button onClick={() => handleEdit(coupon)} className="flex-1 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                  <FiEdit3 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-md shadow-lg">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-md transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE20"
                    required
                    className="flex-1 px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-mono uppercase focus:border-orange-400 outline-none"
                  />
                  <button type="button" onClick={generateCode} className="px-3 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors">
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Coupon Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Summer Sale 20%"
                  required
                  className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                    min="0"
                    required
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Min. Purchase (৳)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: e.target.value }))}
                    min="0"
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Max Discount (৳)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                    placeholder="Optional"
                    min="0"
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Per User</label>
                  <input
                    type="number"
                    value={formData.usagePerUser}
                    onChange={(e) => setFormData(prev => ({ ...prev, usagePerUser: e.target.value }))}
                    min="1"
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Applicable To</label>
                <select
                  value={formData.applicableTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicableTo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm focus:border-orange-400 outline-none"
                >
                  <option value="all">All Products</option>
                  <option value="course">Courses Only</option>
                  <option value="website">Websites Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-md">
                <span className="text-sm text-slate-600 dark:text-slate-300">Active Status</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors">
                  {editingCoupon ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;

