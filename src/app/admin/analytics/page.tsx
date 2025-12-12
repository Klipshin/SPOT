"use client";

import React from 'react';
import InfoCards from '@/src/components/admin/InfoCards';
import useAnalytics from '@/src/lib/hooks/useAnalytics';

function BarChart({ data, maxValue, color = "#4A654D" }: { data: { date: string; count: number }[] | { month: string; count: number }[], maxValue: number, color?: string }) {
  const labelKey = 'date' in data[0] ? 'date' : 'month';
  
  return (
    <div className="flex items-end justify-between h-64 gap-1">
      {data.map((item, index) => {
        const value = item.count;
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const label = item[labelKey as keyof typeof item] as string;
        
        return (
          <div key={index} className="flex flex-col items-center flex-1 group relative">
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                minHeight: value > 0 ? '4px' : '0px',
              }}
              title={`${label}: ${value}`}
            />
            <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap font-poppins text-[10px]">
              {typeof label === 'string' && label.length > 8 ? label.substring(0, 8) + '...' : label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PieChart({ data, colors = ["#4A654D", "#C4DA83", "#FFC048", "#BF0003"] }: { data: { type: string; count: number }[], colors?: string[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.count / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      angle,
      color: colors[index % colors.length],
    };
  });

  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {segments.map((segment, index) => {
          if (segment.count === 0) return null;
          
          const startAngleRad = (segment.startAngle * Math.PI) / 180;
          const endAngleRad = ((segment.startAngle + segment.angle) * Math.PI) / 180;
          
          const x1 = centerX + radius * Math.cos(startAngleRad - Math.PI / 2);
          const y1 = centerY + radius * Math.sin(startAngleRad - Math.PI / 2);
          const x2 = centerX + radius * Math.cos(endAngleRad - Math.PI / 2);
          const y2 = centerY + radius * Math.sin(endAngleRad - Math.PI / 2);
          
          const largeArcFlag = segment.angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');
          
          return (
            <path
              key={index}
              d={pathData}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title={`${segment.type}: ${segment.count} (${segment.percentage.toFixed(1)}%)`}
            />
          );
        })}
      </svg>
      <div className="mt-4 space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: segment.color }}
            />
            <span className="font-poppins text-sm">
              {segment.type.charAt(0).toUpperCase() + segment.type.slice(1)}: {segment.count} ({segment.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-xl font-poppins">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-xl font-poppins text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-xl font-poppins">No analytics data available</p>
      </div>
    );
  }

  const maxUserGrowth = Math.max(...analytics.userGrowth.map(d => d.count), 1);
  const maxPostGrowth = Math.max(...analytics.postGrowth.map(d => d.count), 1);
  const maxUsersByMonth = Math.max(...analytics.usersByMonth.map(d => d.count), 1);
  const maxPostsByMonth = Math.max(...analytics.postsByMonth.map(d => d.count), 1);

  return (
    <div className="relative flex flex-col mt-3 space-y-5 w-full px-5">
      <div className="absolute -right-10 w-120 rounded-full bg-[#D0E69080] py-2 px-7 text-2xl font-poppins-bold">
        ANALYTICS DASHBOARD
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <InfoCards 
          icon="/total-users.svg"
          title="Total Users"
          data={analytics.totalUsers}
        />
        <InfoCards 
          icon="/verified-users.svg"
          title="Verified Experts"
          data={analytics.verifiedExperts}
        />
        <InfoCards 
          icon="/total-reports.svg"
          title="Total Posts"
          data={analytics.totalPosts}
        />
        <InfoCards 
          icon="/total-reports.svg"
          title="Total Reports"
          data={analytics.totalReports}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-white/35 rounded-2xl p-5">
          <div className="font-poppins-bold text-lg text-gray-700">Active Users</div>
          <div className="font-poppins-bold text-4xl text-[#082E0D] mt-2">{analytics.activeUsers}</div>
          <div className="font-poppins text-sm text-gray-600 mt-1">
            {analytics.suspendedUsers} suspended
          </div>
        </div>
        <div className="bg-white/35 rounded-2xl p-5">
          <div className="font-poppins-bold text-lg text-gray-700">Pending Experts</div>
          <div className="font-poppins-bold text-4xl text-[#FFC048] mt-2">{analytics.pendingExperts}</div>
          <div className="font-poppins text-sm text-gray-600 mt-1">
            {analytics.totalExperts} total
          </div>
        </div>
        <div className="bg-white/35 rounded-2xl p-5">
          <div className="font-poppins-bold text-lg text-gray-700">Comments</div>
          <div className="font-poppins-bold text-4xl text-[#082E0D] mt-2">{analytics.totalComments}</div>
          <div className="font-poppins text-sm text-gray-600 mt-1">
            {analytics.totalVotes} votes ({analytics.upvotes}↑ / {analytics.downvotes}↓)
          </div>
        </div>
        <div className="bg-white/35 rounded-2xl p-5">
          <div className="font-poppins-bold text-lg text-gray-700">Active Reports</div>
          <div className="font-poppins-bold text-4xl text-[#BF0003] mt-2">{analytics.activeReports}</div>
          <div className="font-poppins text-sm text-gray-600 mt-1">
            {analytics.dismissedReports} dismissed
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* User Growth (Last 30 Days) */}
        <div className="bg-white/35 rounded-2xl p-5">
          <h3 className="font-poppins-bold text-xl text-[#082E0D] mb-4">User Growth (Last 30 Days)</h3>
          <BarChart data={analytics.userGrowth} maxValue={maxUserGrowth} color="#4A654D" />
        </div>

        {/* Post Growth (Last 30 Days) */}
        <div className="bg-white/35 rounded-2xl p-5">
          <h3 className="font-poppins-bold text-xl text-[#082E0D] mb-4">Post Growth (Last 30 Days)</h3>
          <BarChart data={analytics.postGrowth} maxValue={maxPostGrowth} color="#C4DA83" />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Monthly User Growth */}
        <div className="bg-white/35 rounded-2xl p-5">
          <h3 className="font-poppins-bold text-xl text-[#082E0D] mb-4">Users by Month (Last 12 Months)</h3>
          <BarChart data={analytics.usersByMonth} maxValue={maxUsersByMonth} color="#4A654D" />
        </div>

        {/* Monthly Post Growth */}
        <div className="bg-white/35 rounded-2xl p-5">
          <h3 className="font-poppins-bold text-xl text-[#082E0D] mb-4">Posts by Month (Last 12 Months)</h3>
          <BarChart data={analytics.postsByMonth} maxValue={maxPostsByMonth} color="#C4DA83" />
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Reports by Type */}
        <div className="bg-white/35 rounded-2xl p-5">
          <h3 className="font-poppins-bold text-xl text-[#082E0D] mb-4">Reports by Type</h3>
          <PieChart data={analytics.reportsByType} />
        </div>

        {/* Additional Stats */}
        <div className="bg-white/35 rounded-2xl p-5">
          <h3 className="font-poppins-bold text-xl text-[#082E0D] mb-4">Platform Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-poppins text-gray-700">Total Communities</span>
              <span className="font-poppins-bold text-2xl text-[#082E0D]">{analytics.totalCommunities}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-poppins text-gray-700">User Engagement Rate</span>
              <span className="font-poppins-bold text-2xl text-[#082E0D]">
                {analytics.totalUsers > 0 
                  ? ((analytics.totalPosts / analytics.totalUsers) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-poppins text-gray-700">Avg Posts per User</span>
              <span className="font-poppins-bold text-2xl text-[#082E0D]">
                {analytics.totalUsers > 0 
                  ? (analytics.totalPosts / analytics.totalUsers).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-poppins text-gray-700">Report Resolution Rate</span>
              <span className="font-poppins-bold text-2xl text-[#082E0D]">
                {analytics.totalReports > 0
                  ? ((analytics.dismissedReports / analytics.totalReports) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
