'use client';
import { API_URL } from '@/config/api';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiSearch, FiUsers, FiTrash2, FiPlus, FiCalendar, FiLoader, FiCheck, FiRefreshCw, FiEdit3, FiX
} from 'react-icons/fi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/user/create?edit=${id}`);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/admin/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-[#021E14] dark:bg-[#021E14]/20 text-[#021E14] dark:text-[#021E14]';
      case 'mentor': return 'bg-amber-100 dark:bg-[#D4AF37]/20 text-amber-600 dark:text-[#D4AF37]';
      case 'student': return 'bg-[#021E14] dark:bg-[#021E14]/20 text-[#021E14] dark:text-[#021E14]';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 dark:bg-[#021E14]/20 text-[#021E14] dark:text-emerald-400';
      case 'blocked': return 'bg-[#021E14] dark:bg-[#021E14]/20 text-[#021E14] dark:text-[#021E14]';
      case 'pending': return 'bg-amber-100 dark:bg-[#D4AF37]/20 text-amber-600 dark:text-[#D4AF37]';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length,
  };

  return (
    <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#021E14] flex items-center justify-center">
            <FiUsers className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Users</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage platform users</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-all disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link href="/dashboard/admin/user/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#021E14] hover:bg-[#021E14] text-white rounded-md text-sm font-medium transition-all">
              <FiPlus size={14} />
              Add User
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#021E14] rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#021E14] rounded-md flex items-center justify-center">
              <FiCheck className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.active}</span>
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Users</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#021E14] rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.students}</span>
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-[#021E14] rounded-md flex items-center justify-center">
              <FiX className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total - stats.active}</span>
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inactive/Blocked</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-[#021E14] outline-none text-xs transition-all"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FiLoader className="animate-spin text-[#021E14]" size={28} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FiUsers size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Email</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Role</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Joined</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#021E14] flex items-center justify-center text-white text-xs font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{user.firstName} {user.lastName}</p>
                          {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${getRoleBadge(user.role)}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${getStatusBadge(user.status)}`}>
                        {user.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <FiCalendar size={12} />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="p-1.5 bg-[#021E14] dark:bg-[#021E14]/20 text-[#021E14] dark:text-[#021E14] rounded-md hover:bg-[#021E14] hover:text-white transition-all shadow-sm"
                          title="Edit User"
                        >
                          <FiEdit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-1.5 text-[#021E14] hover:text-[#021E14] hover:bg-[#021E14] dark:hover:bg-[#021E14]/10 rounded-md transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
