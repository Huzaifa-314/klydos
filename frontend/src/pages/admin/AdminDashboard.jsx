import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    refunds: 0,
    todayDonations: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/metrics
    setTimeout(() => {
      setMetrics({
        totalRaised: 2500000,
        activeCampaigns: 45,
        totalDonors: 12500,
        refunds: 1250,
        todayDonations: 12500,
      });

      setRecentActivity([
        { id: 1, type: 'donation', message: 'New donation of $100 to "Help Build a School"', time: '5 minutes ago', status: 'success' },
        { id: 2, type: 'campaign', message: 'New campaign "Emergency Relief Fund" created', time: '15 minutes ago', status: 'info' },
        { id: 3, type: 'donation', message: 'Donation of $50 failed - payment declined', time: '1 hour ago', status: 'error' },
        { id: 4, type: 'user', message: 'New user registered: john@example.com', time: '2 hours ago', status: 'success' },
        { id: 5, type: 'refund', message: 'Refund processed for $200', time: '3 hours ago', status: 'warning' },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const metricCards = [
    {
      title: 'Total Raised',
      value: `$${metrics.totalRaised.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Active Campaigns',
      value: metrics.activeCampaigns,
      change: '+3',
      changeType: 'positive',
      icon: '📋',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Donors',
      value: metrics.totalDonors.toLocaleString(),
      change: '+245',
      changeType: 'positive',
      icon: '👥',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Refunds',
      value: `$${metrics.refunds.toLocaleString()}`,
      change: '-2.1%',
      changeType: 'negative',
      icon: '↩️',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: "Today's Donations",
      value: `$${metrics.todayDonations.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'positive',
      icon: '💵',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of your platform's performance</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/campaigns/create"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ➕ Create Campaign
          </Link>
          <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200">
            ⏸️ Pause Campaign
          </button>
          <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200">
            ↩️ Process Refund
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {metricCards.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {metric.icon}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.status === 'success'
                          ? 'bg-green-100'
                          : activity.status === 'error'
                          ? 'bg-red-100'
                          : activity.status === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      {activity.type === 'donation' && '💰'}
                      {activity.type === 'campaign' && '📋'}
                      {activity.type === 'user' && '👤'}
                      {activity.type === 'refund' && '↩️'}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Donations Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - Integrate with Grafana or Chart.js</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

