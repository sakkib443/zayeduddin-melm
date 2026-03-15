'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBatches } from '@/redux/batchSlice';
import { FiCalendar, FiClock, FiVideo, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/context/LanguageContext';

const DAY_MAP = {
    saturday: { short: 'Sat', index: 5 },
    sunday: { short: 'Sun', index: 6 },
    monday: { short: 'Mon', index: 0 },
    tuesday: { short: 'Tue', index: 1 },
    wednesday: { short: 'Wed', index: 2 },
    thursday: { short: 'Thu', index: 3 },
    friday: { short: 'Fri', index: 4 },
};

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function UserSchedulePage() {
    const { isDark } = useTheme();
    const { t } = useLanguage();
    const dispatch = useDispatch();
    const { myBatches = [], loading } = useSelector((state) => state.batch);
    const [currentWeek, setCurrentWeek] = useState(0);

    useEffect(() => {
        dispatch(fetchMyBatches());
    }, [dispatch]);

    // Build schedule from batches
    const scheduleByDay = {};
    DAY_NAMES.forEach(d => { scheduleByDay[d] = []; });

    myBatches.forEach(batch => {
        if (batch.status !== 'ongoing' && batch.status !== 'upcoming') return;
        batch.schedule?.forEach(sch => {
            const dayInfo = DAY_MAP[sch.day];
            if (dayInfo) {
                scheduleByDay[dayInfo.short].push({
                    batchName: batch.batchName,
                    courseName: batch.course?.title || 'Course',
                    startTime: sch.startTime,
                    endTime: sch.endTime,
                    meetingLink: batch.meetingLink,
                    status: batch.status,
                });
            }
        });
    });

    // Week dates for calendar
    const getWeekDates = (weekOffset = 0) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    };

    const weekDates = getWeekDates(currentWeek);
    const totalClasses = Object.values(scheduleByDay).reduce((sum, arr) => sum + arr.length, 0);
    const todayName = DAY_NAMES[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const todayClasses = scheduleByDay[todayName]?.length || 0;

    const cardClass = `rounded-xl border transition-all ${isDark
        ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`;

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
            <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.schedule.title')}</h1>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.schedule.description')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`${cardClass} p-4`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#021E14]/10 flex items-center justify-center">
                            <FiCalendar className="text-[#021E14]" size={18} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{todayClasses}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.schedule.classesToday')}</p>
                        </div>
                    </div>
                </div>
                <div className={`${cardClass} p-4`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FiClock className="text-blue-600" size={18} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{totalClasses}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.schedule.weeklyClasses')}</p>
                        </div>
                    </div>
                </div>
                <div className={`${cardClass} p-4`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <FiVideo className="text-emerald-600" size={18} />
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming').length}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.schedule.activeBatches')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Calendar */}
            <div className={`${cardClass} p-5`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.schedule.weeklyView')}</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentWeek(currentWeek - 1)} className={`p-1.5 rounded-md border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <FiChevronLeft size={14} />
                        </button>
                        <span className={`px-3 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <button onClick={() => setCurrentWeek(currentWeek + 1)} className={`p-1.5 rounded-md border ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <FiChevronRight size={14} />
                        </button>
                        <button onClick={() => setCurrentWeek(0)} className="px-2 py-1 text-[10px] font-bold text-[#021E14] hover:bg-[#021E14]/10 rounded-md transition">
                            {t('userDashboard.schedule.today')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, index) => {
                        const isToday = new Date().toDateString() === date.toDateString();
                        const dayName = DAY_NAMES[index];
                        const dayClasses = scheduleByDay[dayName] || [];

                        return (
                            <div key={index}
                                className={`min-h-[140px] p-2.5 rounded-lg border ${isToday
                                    ? (isDark ? 'border-[#021E14] bg-[#021E14]/10' : 'border-[#021E14] bg-[#021E14]/5')
                                    : (isDark ? 'border-white/5 bg-slate-800/30' : 'border-slate-200 bg-slate-50')
                                    }`}
                            >
                                <div className="text-center mb-2">
                                    <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{dayName}</p>
                                    <p className={`text-sm font-bold ${isToday ? 'text-[#021E14]' : isDark ? 'text-white' : 'text-slate-700'}`}>
                                        {date.getDate()}
                                    </p>
                                </div>
                                {dayClasses.length > 0 ? (
                                    <div className="space-y-1">
                                        {dayClasses.map((cls, idx) => (
                                            <div key={idx} className={`p-1.5 rounded-md text-[9px] ${isDark ? 'bg-[#021E14]/20 text-[#4ade80]' : 'bg-[#021E14]/10 text-[#021E14]'}`}>
                                                <p className="font-bold truncate">{cls.courseName}</p>
                                                <p className="opacity-70">{cls.startTime}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3">
                                        <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>—</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* All Batch Schedules List */}
            <div className={`${cardClass} overflow-hidden`}>
                <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.schedule.batchScheduleDetails')}</h2>
                </div>
                {myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming').length === 0 ? (
                    <div className="p-8 text-center">
                        <FiCalendar className={`mx-auto text-2xl mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('userDashboard.schedule.noActiveBatches')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {myBatches.filter(b => b.status === 'ongoing' || b.status === 'upcoming').map(batch => (
                            <div key={batch._id} className={`p-4 ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} transition-colors`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${batch.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{batch.batchName}</h3>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{batch.course?.title}</p>

                                        {/* Schedule days */}
                                        {batch.schedule?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {batch.schedule.map((sch, idx) => (
                                                    <span key={idx} className={`px-2 py-1 rounded-md text-[10px] font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                        {DAY_MAP[sch.day]?.short || sch.day} {sch.startTime} - {sch.endTime}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {batch.meetingLink && (
                                        <a href={batch.meetingLink} target="_blank" rel="noopener noreferrer"
                                            className="shrink-0 px-3 py-1.5 bg-[#021E14] text-white rounded-md text-[10px] font-bold hover:bg-[#021E14]/90 transition-all flex items-center gap-1">
                                            <FiVideo size={10} /> {t('userDashboard.schedule.joinClass')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
