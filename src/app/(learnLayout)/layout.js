'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from '@/redux/store';

export default function LearnLayout({ children }) {
    return (
        <Provider store={store}>
            <div className="min-h-screen bg-slate-50 font-poppins">
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: '#fff',
                            color: '#1e293b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '14px 18px',
                            fontFamily: 'Poppins, sans-serif',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                {children}
            </div>
        </Provider>
    );
}
