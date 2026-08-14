// AdminDashboard.jsx – A world‑class dashboard, 100x better than OYO's

import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  FiUsers, FiHome, FiCalendar, FiDollarSign,
  FiTrendingUp, FiTrendingDown, FiMoreHorizontal,
  FiEye, FiDownload, FiRefreshCw
} from 'react-icons/fi';

// Dummy data generators
const generateMonthlyData = () => [
  { name: 'Jan', revenue: 420000, bookings: 145, occupancy: 72 },
  { name: 'Feb', revenue: 485000, bookings: 162, occupancy: 75 },
  { name: 'Mar', revenue: 510000, bookings: 178, occupancy: 78 },
  { name: 'Apr', revenue: 498000, bookings: 170, occupancy: 76 },
  { name: 'May', revenue: 612000, bookings: 210, occupancy: 82 },
  { name: 'Jun', revenue: 725000, bookings: 245, occupancy: 86 },
  { name: 'Jul', revenue: 810000, bookings: 278, occupancy: 89 },
  { name: 'Aug', revenue: 795000, bookings: 265, occupancy: 88 },
  { name: 'Sep', revenue: 680000, bookings: 230, occupancy: 83 },
  { name: 'Oct', revenue: 590000, bookings: 198, occupancy: 79 },
  { name: 'Nov', revenue: 540000, bookings: 180, occupancy: 76 },
  { name: 'Dec', revenue: 650000, bookings: 215, occupancy: 81 },
];

const recentBookingsData = [
  { id: '#BK1024', guest: 'Rahul Sharma', hotel: 'Grand Palace', checkIn: '2025-02-14', amount: '₹12,500', status: 'confirmed', payment: 'paid' },
  { id: '#BK1025', guest: 'Priya Singh', hotel: 'Ocean View', checkIn: '2025-02-15', amount: '₹8,200', status: 'pending', payment: 'pending' },
  { id: '#BK1026', guest: 'Amit Kumar', hotel: 'Mountain Retreat', checkIn: '2025-02-13', amount: '₹5,800', status: 'confirmed', payment: 'paid' },
  { id: '#BK1027', guest: 'Neha Gupta', hotel: 'City Inn', checkIn: '2025-02-16', amount: '₹3,400', status: 'cancelled', payment: 'refunded' },
  { id: '#BK1028', guest: 'Vikram Mehta', hotel: 'Grand Palace', checkIn: '2025-02-17', amount: '₹15,000', status: 'confirmed', payment: 'paid' },
];

const topHotelsData = [
  { name: 'Grand Palace', revenue: 425000, bookings: 98, rating: 4.8 },
  { name: 'Ocean View', revenue: 382000, bookings: 87, rating: 4.9 },
  { name: 'Mountain Retreat', revenue: 298000, bookings: 65, rating: 4.7 },
  { name: 'City Inn', revenue: 276000, bookings: 72, rating: 4.5 },
  { name: 'Lake Resort', revenue: 215000, bookings: 54, rating: 4.6 },
];

const bookingStatusData = [
  { name: 'Confirmed', value: 1248 },
  { name: 'Pending', value: 342 },
  { name: 'Cancelled', value: 156 },
  { name: 'Refunded', value: 48 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const StatCard = ({ title, value, change, icon: Icon, trend, color }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? FiTrendingUp : FiTrendingDown;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center">
          <TrendIcon className={`w-4 h-4 mr-1 ${trendColor}`} />
          <span className={trendColor}>{change}</span>
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [monthlyData, setMonthlyData] = useState(generateMonthlyData());
  const [recentBookings, setRecentBookings] = useState(recentBookingsData);
  const [topHotels, setTopHotels] = useState(topHotelsData);
  const [bookingStatus, setBookingStatus] = useState(bookingStatusData);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('year'); // 'month', 'quarter', 'year'

  // Simulate data refresh
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setMonthlyData(generateMonthlyData());
      setLoading(false);
    }, 800);
  };

  // Summary stats
  const summaryStats = [
    { title: 'Total Revenue', value: '₹1,24,56,890', change: '+12.5%', icon: FiDollarSign, trend: 'up', color: 'bg-green-500' },
    { title: 'Total Bookings', value: '1,794', change: '+8.2%', icon: FiCalendar, trend: 'up', color: 'bg-blue-500' },
    { title: 'Occupancy Rate', value: '81%', change: '+3.1%', icon: FiHome, trend: 'up', color: 'bg-purple-500' },
    { title: 'Active Users', value: '3,456', change: '-2.4%', icon: FiUsers, trend: 'down', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={refreshData}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <FiDownload size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FiMoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${value/1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings & Occupancy */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bookings & Occupancy</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FiMoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis yAxisId="left" stroke="#6B7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="bookings" fill="#10B981" name="Bookings" radius={[4,4,0,0]} />
                <Bar yAxisId="right" dataKey="occupancy" fill="#8B5CF6" name="Occupancy %" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row: Booking Status Pie & Top Hotels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Status</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FiMoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {bookingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {bookingStatus.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Hotels */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Hotels by Revenue</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FiMoreHorizontal size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Hotel</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                  <th className="px-4 py-3 text-left">Bookings</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topHotels.map((hotel) => (
                  <tr key={hotel.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{hotel.name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{hotel.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{hotel.bookings}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-700 dark:text-gray-300">{hotel.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(hotel.revenue / 500000) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
          <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <FiEye size={16} />
            <span>View All</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Booking ID</th>
                <th className="px-4 py-3 text-left">Guest</th>
                <th className="px-4 py-3 text-left">Hotel</th>
                <th className="px-4 py-3 text-left">Check In</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-900 dark:text-white">{booking.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{booking.guest}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{booking.hotel}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{booking.checkIn}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{booking.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                    `}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full
                      ${booking.payment === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${booking.payment === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${booking.payment === 'refunded' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400' : ''}
                    `}>
                      {booking.payment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;