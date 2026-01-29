'use client';
import { API_URL } from '@/config/api';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSettings, FiSave, FiBell, FiLock, FiGlobe, FiDollarSign, FiChevronRight, FiCheck } from 'react-icons/fi';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Jayed Uddin',
    siteEmail: 'admin@jayeduddin.com',
    currency: 'BDT',
    currencySymbol: '৳',
    emailNotifications: true,
    orderNotifications: true,
    maintenanceMode: false,
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => { if (tabFromUrl) setActiveTab(tabFromUrl); }, [tabFromUrl]);

  const handleChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(passwordData)
      });
      const result = await response.json();
      if (response.ok) {
        setPasswordSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPasswordError(result.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'payment', label: 'Payment', icon: FiDollarSign },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 dark:bg-slate-600 rounded-md flex items-center justify-center">
            <FiSettings className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Settings</h1>
            <p className="text-sm text-slate-500">Manage platform settings</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {saving ? <FiCheck size={16} /> : <FiSave size={16} />}
          {saving ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-3 h-fit">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} />
                    {tab.label}
                  </span>
                  <FiChevronRight size={14} className={activeTab === tab.id ? 'text-blue-500' : 'text-slate-300'} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-5">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white pb-3 border-b border-gray-200 dark:border-slate-700">General Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Site Email</label>
                  <input
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => handleChange('siteEmail', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                  >
                    <option value="BDT">BDT - Bangladeshi Taka</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Maintenance Mode</p>
                  <p className="text-xs text-slate-500">Put your site in maintenance mode</p>
                </div>
                <button
                  onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white pb-3 border-b border-gray-200 dark:border-slate-700">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive email alerts for important updates</p>
                  </div>
                  <button
                    onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 ${settings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Order Notifications</p>
                    <p className="text-xs text-slate-500">Get notified when new orders come in</p>
                  </div>
                  <button
                    onClick={() => handleChange('orderNotifications', !settings.orderNotifications)}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center p-0.5 ${settings.orderNotifications ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.orderNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white pb-3 border-b border-gray-200 dark:border-slate-700">Security Settings</h3>

              <form onSubmit={handlePasswordUpdate} className="p-4 rounded-md bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <FiLock className="text-blue-500" size={16} />
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Update Password</p>
                </div>

                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-xs border border-red-200">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-md text-xs border border-emerald-200">{passwordSuccess}</div>
                )}

                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-blue-400 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiSave size={14} />
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-blue-500" size={18} />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Add extra security to your account</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white pb-3 border-b border-gray-200 dark:border-slate-700">Payment Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-md border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-pink-500 flex items-center justify-center text-white text-xs font-medium">bK</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">bKash</p>
                      <p className="text-xs text-emerald-600">Active</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-blue-500">Configure →</button>
                </div>
                <div className="p-4 rounded-md border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-medium">N</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Nagad</p>
                      <p className="text-xs text-slate-400">Inactive</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-blue-500">Setup →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

