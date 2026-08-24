import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({ categories: 0, subcategories: 0, products: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStatsData(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Categories', value: statsData.categories, icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'text-blue-500', bg: 'bg-[#e0e7ff]' },
    { label: 'Total Subcategories', value: statsData.subcategories, icon: 'M4 6h16M4 12h16m-7 6h7', color: 'text-purple-500', bg: 'bg-[#f3e8ff]' },
    { label: 'Total Products', value: statsData.products, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-emerald-500', bg: 'bg-[#d1fae5]' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
      <p className="text-sm text-slate-500 mt-1 mb-8">Welcome back to AMPS Admin Panel</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[18px] flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">{stat.label}</p>
              <p className="text-[32px] font-bold text-slate-900 leading-tight mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[20px] p-8 shadow-sm border border-slate-100 min-h-[350px]">
        <h3 className="text-lg font-bold text-slate-800 mb-8">Recent Activity</h3>
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-medium">
          No recent activity found.
        </div>
      </div>
    </div>
  );
}
