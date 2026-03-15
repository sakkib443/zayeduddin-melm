'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiVideo, FiCalendar, FiClock, FiExternalLink,
    FiPlay, FiBook, FiRefreshCw
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL } from '@/config/api';

export default function MyLiveClassesPage() {
    const { isDark } = useTheme();
    const { t } = useLanguage();
    const [myBatches, setMyBatches] = useState([]);
    const [liveClasses, setLiveClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [batchRes, classRes] = await Promise.all([
                fetch(`${API_URL}/batches/my-batches`, { headers }),
                fetch(`${API_URL}/live-classes/my-classes`, { headers }),
            ]);

            const batchData = await batchRes.json();
            const classData = await classRes.json();

            if (batchData.success) setMyBatches(batchData.data || []);
            if (classData.success) setLiveClasses(classData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = () => {
        setIsSyncing(true);
        fetchData();
        setTimeout(() => setIsSyncing(false), 1000);
    };

    const getDayName = (day) => {
        const days = { saturday: 'Sat', sunday: 'Sun', monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri' };
        return days[day?.toLowerCase()] || day;
    };

    const getCurrentDayKey = () => {
        const map = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
        return map[new Date().getDay()];
    };

    const isTodayClass = (schedule) => {
        if (!schedule || schedule.length === 0) return false;
        return schedule.some(s => s.day?.toLowerCase() === getCurrentDayKey());
    };

    const getTodaySchedule = (schedule) => {
        if (!schedule || schedule.length === 0) return null;
        return schedule.find(s => s.day?.toLowerCase() === getCurrentDayKey());
    };

    const cardClass = `rounded-xl border transition-all ${isDark
        ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`;

    const activeBatches = myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming');
    const todayBatches = activeBatches.filter(b => isTodayClass(b.schedule));
    const otherBatches = activeBatches.filter(b => !isTodayClass(b.schedule));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-[#021E14] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 ${cardClass}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#021E14] flex items-center justify-center text-white">
                        <FiVideo size={20} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.liveClasses.title')}</h1>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.liveClasses.description')}</p>
                    </div>
                </div>
                <button onClick={handleSync}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDark
                        ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    <FiRefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> Sync
                </button>
            </div>

            {/* Upcoming Live Classes from API */}
            {liveClasses.length > 0 && (
                <div>
                    <h2 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        {t('userDashboard.liveClasses.upcomingLiveClasses')}
                    </h2>
                    <div className="space-y-3">
                        {liveClasses.map((cls) => (
                            <div key={cls._id} className={`${cardClass} p-4 ${cls.status === 'live' ? 'ring-1 ring-red-400' : ''}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${cls.status === 'live'
                                                ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {cls.status === 'live' ? `🔴 ${t('userDashboard.main.live')}` : `📅 ${t('userDashboard.liveClasses.scheduled')}`}
                                            </span>
                                            {cls.classNumber && (
                                                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Class #{cls.classNumber}</span>
                                            )}
                                        </div>
                                        <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{cls.title}</h3>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {cls.batch?.course?.title || cls.batch?.batchName}
                                        </p>
                                        <div className={`mt-1.5 flex items-center gap-3 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <span className="flex items-center gap-1">
                                                <FiCalendar size={10} />
                                                {new Date(cls.classDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock size={10} /> {cls.startTime} - {cls.endTime}
                                            </span>
                                        </div>
                                    </div>
                                    {(cls.meetingLink || cls.batch?.meetingLink) ? (
                                        <a href={cls.meetingLink || cls.batch?.meetingLink} target="_blank" rel="noopener noreferrer"
                                            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105 ${cls.status === 'live'
                                                ? 'bg-red-500 text-white shadow-sm' : 'bg-[#021E14] text-white shadow-sm'}`}>
                                            <FiPlay size={12} /> {cls.status === 'live' ? t('userDashboard.liveClasses.joinNow') : t('userDashboard.liveClasses.joinClass')}
                                        </a>
                                    ) : (
                                        <span className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
                                            <FiClock size={12} /> Link coming soon
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Today's Batch Classes */}
            {todayBatches.length > 0 && (
                <div>
                    <h2 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.liveClasses.todaysBatchClasses')}</h2>
                    <div className="space-y-3">
                        {todayBatches.map((batch) => {
                            const todaySchedule = getTodaySchedule(batch.schedule);
                            return (
                                <div key={batch._id} className={`${cardClass} p-4`}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{batch.batchName}</h3>
                                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{batch.course?.title}</p>
                                            {todaySchedule && (
                                                <p className={`text-[10px] mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    <FiClock size={10} /> {todaySchedule.startTime} - {todaySchedule.endTime}
                                                </p>
                                            )}
                                        </div>
                                        {batch.meetingLink ? (
                                            <a href={batch.meetingLink} target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-2 bg-[#021E14] text-white rounded-lg text-xs font-bold hover:bg-[#021E14]/90 transition-all flex items-center gap-1.5">
                                                <FiVideo size={12} /> {t('userDashboard.main.join')}
                                            </a>
                                        ) : (
                                            <span className={`px-3 py-2 rounded-lg text-xs font-semibold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
                                                No link yet
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Other Active Batches */}
            {otherBatches.length > 0 && (
                <div>
                    <h2 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.liveClasses.otherActiveBatches')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {otherBatches.map((batch) => (
                            <div key={batch._id} className={`${cardClass} p-4`}>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{batch.batchName}</h3>
                                        <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{batch.batchCode}</p>
                                    </div>
                                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${batch.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {batch.status}
                                    </span>
                                </div>
                                <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{batch.course?.title}</p>
                                {batch.schedule?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {batch.schedule.map((s, i) => (
                                            <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                {getDayName(s.day)} {s.startTime}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {batch.meetingLink ? (
                                    <a href={batch.meetingLink} target="_blank" rel="noopener noreferrer"
                                        className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDark
                                            ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        <FiExternalLink size={12} /> {t('userDashboard.liveClasses.meetingLink')}
                                    </a>
                                ) : (
                                    <div className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${isDark
                                        ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                                        <FiClock size={12} /> Meeting link not added yet
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {activeBatches.length === 0 && liveClasses.length === 0 && (
                <div className={`${cardClass} p-10 text-center`}>
                    <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <FiVideo size={24} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.liveClasses.noLiveClasses')}</h3>
                    <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {myBatches.length === 0 ? t('userDashboard.liveClasses.enrollToAccess') : t('userDashboard.liveClasses.noLinksYet')}
                    </p>
                    <Link href="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-[#021E14] text-white rounded-lg font-semibold text-xs hover:bg-[#021E14]/90 transition-all">
                        {t('userDashboard.main.browseCourses')} <FiExternalLink size={12} />
                    </Link>
                </div>
            )}
        </div>
    );
}
