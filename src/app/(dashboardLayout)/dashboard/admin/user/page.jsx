'use client';
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiSearch, FiUsers, FiTrash2, FiPlus, FiCalendar, FiLoader, FiCheck, FiX, FiRefreshCw
} from 'react-icons/fi';



const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

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

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditData({ role: user.role, status: user.status });
  };

  const handleSave = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/admin/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      alert('Error updating');
    }
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
      case 'admin': return 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400';
      case 'mentor': return 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'student': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      case 'blocked': return 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400';
      case 'pending': return 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';
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
          <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center">
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
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-all">
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
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Users</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.students}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-rose-500 rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.admins}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Admins</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
              <FiCheck className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.active}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FiLoader className="animate-spin text-indigo-500" size={28} />
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
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium">
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
                      {editingUser === user._id ? (
                        <select
                          value={editData.role}
                          onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                          className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-xs focus:border-indigo-500 outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${getRoleBadge(user.role)}`}>
                          {user.role?.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editingUser === user._id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-xs focus:border-indigo-500 outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${getStatusBadge(user.status)}`}>
                          {user.status?.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <FiCalendar size={12} />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {editingUser === user._id ? (
                          <>
                            <button
                              onClick={() => handleSave(user._id)}
                              className="p-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="p-1.5 bg-slate-400 text-white rounded-md hover:bg-slate-500 transition-colors"
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-md transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </>
                        )}
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

