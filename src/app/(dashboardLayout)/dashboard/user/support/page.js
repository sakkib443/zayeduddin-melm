'use client';

import React, { useState } from 'react';
import { FiHelpCircle, FiMessageCircle, FiPhone, FiMail, FiClock, FiChevronDown, FiChevronUp, FiExternalLink, FiLoader, FiSend } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserSupportPage() {
    const { isDark } = useTheme();
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: 'general',
        message: '',
    });

    const faqs = [
        {
            id: 1,
            question: 'How do I enroll in a course?',
            answer: 'To enroll in a course, browse our course catalog, select the course you want, and click the "Enroll Now" button. Complete the payment process to gain access to the course materials.',
        },
        {
            id: 2,
            question: 'How can I get my certificate?',
            answer: 'Certificates are automatically generated once you complete all the lessons and assignments in a course. You can download your certificate from the Certificates page in your dashboard.',
        },
        {
            id: 3,
            question: 'What payment methods are accepted?',
            answer: 'We accept bKash, Nagad, and major credit/debit cards. All payments are processed securely through our payment partners.',
        },
        {
            id: 4,
            question: 'Can I get a refund?',
            answer: 'Refund requests can be made within 7 days of purchase if you haven\'t completed more than 20% of the course. Contact our support team for refund requests.',
        },
        {
            id: 5,
            question: 'How do I contact my instructor?',
            answer: 'You can contact your instructor through the course discussion forum or by using the messaging feature in your enrolled course page.',
        },
    ];

    const contactMethods = [
        {
            icon: FiPhone,
            title: 'Phone Support',
            value: '+880 1730-481212',
            subtext: 'Mon-Fri, 9AM-6PM',
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
        },
        {
            icon: FiMail,
            title: 'Email Support',
            value: 'support@ejobsit.com',
            subtext: '24-48 hours response',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
        {
            icon: FiMessageCircle,
            title: 'Live Chat',
            value: 'Coming Soon',
            subtext: 'Real-time support',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
    ];

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        alert('?? Support ticket system is processing. This feature will be available soon!');
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-white/5 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Help & Support
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Get help with your courses and account
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <div
                            key={index}
                            className={`${cardClass} p-6 hover:border-indigo-500/30 group`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${method.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <Icon className={method.color} size={22} />
                                </div>
                                <div>
                                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{method.title}</h3>
                                    <p className={`text-sm font-black outfit mt-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{method.value}</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">{method.subtext}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* FAQs */}
                <div className={`${cardClass} p-8`}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <FiHelpCircle size={20} />
                        </div>
                        <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className={`border rounded-2xl overflow-hidden transition-all ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-indigo-500/5 transition"
                                >
                                    <span className={`font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{faq.question}</span>
                                    {expandedFaq === faq.id ? (
                                        <FiChevronUp className="text-indigo-500" />
                                    ) : (
                                        <FiChevronDown className="text-slate-400" />
                                    )}
                                </button>
                                {expandedFaq === faq.id && (
                                    <div className={`px-4 pb-4 text-xs font-medium leading-relaxed border-t ${isDark ? 'text-slate-400 border-white/5' : 'text-slate-600 border-slate-100'} pt-3`}>
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* More Help Link */}
                    <a
                        href="/help"
                        className="mt-8 flex items-center justify-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-widest hover:underline"
                    >
                        View All FAQs
                        <FiExternalLink size={14} />
                    </a>
                </div>

                {/* Submit Ticket */}
                <div className={`${cardClass} p-8`}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <FiMessageCircle size={20} />
                        </div>
                        <h2 className={`text-lg font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Submit a Support Ticket</h2>
                    </div>

                    <form onSubmit={handleSubmitTicket} className="space-y-6">
                        {/* Subject */}
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Subject</label>
                            <input
                                type="text"
                                value={ticketForm.subject}
                                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                placeholder="Brief description of your issue"
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${isDark
                                    ? 'bg-slate-900 border-white/10 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                    : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm'
                                    }`}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Category</label>
                            <select
                                value={ticketForm.category}
                                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${isDark
                                    ? 'bg-slate-900 border-white/10 text-slate-200 focus:border-indigo-500'
                                    : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 shadow-sm'
                                    }`}
                            >
                                <option value="general">General Inquiry</option>
                                <option value="course">Course Related</option>
                                <option value="payment">Payment Issue</option>
                                <option value="technical">Technical Problem</option>
                                <option value="certificate">Certificate Request</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Message</label>
                            <textarea
                                value={ticketForm.message}
                                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                                placeholder="Describe your issue in detail..."
                                rows={4}
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none ${isDark
                                    ? 'bg-slate-900 border-white/10 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                    : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm'
                                    }`}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                        >
                            <FiSend size={16} />
                            Submit Ticket
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
