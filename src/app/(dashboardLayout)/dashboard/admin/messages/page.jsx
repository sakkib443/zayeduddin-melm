'use client';

import React, { useState } from 'react';
import { FiMail, FiStar, FiTrash2, FiArchive, FiSend, FiInbox, FiEdit } from 'react-icons/fi';

const mockMessages = [
    { id: 1, from: 'John Doe', email: 'john@example.com', subject: 'Course Inquiry', preview: 'Hi, I wanted to ask about the Web Development course...', time: '2h ago', unread: true, starred: true },
    { id: 2, from: 'Sarah Smith', email: 'sarah@example.com', subject: 'Payment Issue', preview: 'I\'m having trouble with my payment for the subscription...', time: '5h ago', unread: true, starred: false },
    { id: 3, from: 'Mike Johnson', email: 'mike@example.com', subject: 'Certificate Request', preview: 'I completed the course but haven\'t received my certificate...', time: '1d ago', unread: false, starred: false },
    { id: 4, from: 'Emily Brown', email: 'emily@example.com', subject: 'Feedback', preview: 'Great platform! I really enjoyed the React course...', time: '2d ago', unread: false, starred: true },
];

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState(mockMessages);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filter, setFilter] = useState('all');

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return msg.unread;
        if (filter === 'starred') return msg.starred;
        return true;
    });

    const toggleStar = (id) => {
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {messages.filter(m => m.unread).length} unread messages
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                    <FiEdit size={16} />
                    Compose
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Message List */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {/* Filters */}
                    <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            {[
                                { id: 'all', label: 'All', icon: FiInbox },
                                { id: 'unread', label: 'Unread', icon: FiMail },
                                { id: 'starred', label: 'Starred', icon: FiStar },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    <f.icon size={12} />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                        {filteredMessages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 cursor-pointer transition-colors ${selectedMessage?.id === msg.id
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10'
                                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                                    } ${msg.unread ? 'font-medium' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-md flex items-center justify-center text-white text-sm font-medium ${msg.unread
                                        ? 'bg-indigo-600'
                                        : 'bg-gray-300 dark:bg-slate-600'
                                        }`}>
                                        {msg.from[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-900 dark:text-white truncate">{msg.from}</p>
                                            <span className="text-xs text-gray-400">{msg.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{msg.subject}</p>
                                        <p className="text-xs text-gray-400 truncate mt-1">{msg.preview}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleStar(msg.id); }}
                                        className={msg.starred ? 'text-amber-500' : 'text-gray-300 dark:text-slate-600'}
                                    >
                                        <FiStar size={14} fill={msg.starred ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 p-5">
                    {selectedMessage ? (
                        <div>
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.subject}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        From: {selectedMessage.from} &lt;{selectedMessage.email}&gt;
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                        <FiArchive size={16} />
                                    </button>
                                    <button className="p-2 rounded-md bg-gray-100 dark:bg-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 rounded-md bg-gray-50 dark:bg-slate-700/50 mb-5">
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {selectedMessage.preview}
                                    <br /><br />
                                    This is a sample message content. In a real application, this would show the full message body fetched from the backend API.
                                    <br /><br />
                                    Best regards,<br />
                                    {selectedMessage.from}
                                </p>
                            </div>

                            {/* Reply Box */}
                            <div>
                                <textarea
                                    placeholder="Write your reply..."
                                    rows={4}
                                    className="w-full p-4 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                <div className="flex justify-end mt-3">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                                        <FiSend size={16} />
                                        Send Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                                    <FiMail size={28} className="text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Select a message to read</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
