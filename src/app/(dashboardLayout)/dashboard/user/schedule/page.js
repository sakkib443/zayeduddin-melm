'use client';

import React, { useState } from 'react';
import { FiCalendar, FiClock, FiVideo, FiMapPin, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function UserSchedulePage() {
    const [currentWeek, setCurrentWeek] = useState(0);

    // Get current week dates
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
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Empty schedule - no classes enrolled yet
    const scheduledClasses = [];

    // Sample upcoming events (placeholder)
    const upcomingEvents = [
        { id: 1, title: 'Web Development Live Session', time: '10:00 AM', type: 'online', instructor: 'John Doe' },
        { id: 2, title: 'UI/UX Workshop', time: '2:00 PM', type: 'online', instructor: 'Jane Smith' },
        { id: 3, title: 'Marketing Masterclass', time: '4:00 PM', type: 'online', instructor: 'Mike Johnson' },
    ];

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 outfit">My Schedule</h1>
                <p className="text-slate-500 mt-1">View your class schedule and upcoming sessions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#E62D26]/10 flex items-center justify-center">
                            <FiCalendar className="text-[#E62D26] text-xl" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                            <p className="text-sm text-slate-500">Classes Today</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <FiClock className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                            <p className="text-sm text-slate-500">This Week</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <FiVideo className="text-amber-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                            <p className="text-sm text-slate-500">Live Sessions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Calendar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Weekly View</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentWeek(currentWeek - 1)}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        <span className="px-4 text-sm font-medium text-slate-600">
                            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => setCurrentWeek(currentWeek + 1)}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                        >
                            <FiChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentWeek(0)}
                            className="ml-2 px-3 py-2 text-sm font-medium text-[#E62D26] hover:bg-[#E62D26]/10 rounded-lg transition"
                        >
                            Today
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, index) => {
                        const isToday = new Date().toDateString() === date.toDateString();
                        return (
                            <div
                                key={index}
                                className={`min-h-[120px] p-3 rounded-xl border ${isToday ? 'border-[#E62D26] bg-[#E62D26]/5' : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <div className="text-center mb-2">
                                    <p className="text-xs text-slate-500">{dayNames[index]}</p>
                                    <p className={`text-lg font-bold ${isToday ? 'text-[#E62D26]' : 'text-slate-700'}`}>
                                        {date.getDate()}
                                    </p>
                                </div>
                                {/* No classes scheduled */}
                                <div className="text-center py-4">
                                    <p className="text-xs text-slate-400">No classes</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upcoming Events (Preview) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FiVideo className="text-[#E62D26]" />
                    Upcoming Events
                </h2>

                <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E62D26] to-[#38a89d] flex items-center justify-center text-white">
                                    <FiVideo size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{event.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <FiClock size={12} />
                                            {event.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiMapPin size={12} />
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => alert('?? Class enrollment is processing. This feature will be available soon!')}
                                className="px-4 py-2 bg-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-[#E62D26] hover:text-white transition flex items-center gap-2"
                            >
                                <FiLoader size={14} className="animate-spin" />
                                Processing
                            </button>
                        </div>
                    ))}
                </div>

                {/* Processing Notice */}
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <FiLoader className="text-amber-600 animate-spin" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-900">Schedule Syncing</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                Once you enroll in courses, your class schedule will automatically sync here.
                                Live sessions and recordings will be accessible from this page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
