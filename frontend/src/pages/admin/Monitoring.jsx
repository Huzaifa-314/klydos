import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const Monitoring = () => {
  const [serviceHealth, setServiceHealth] = useState({
    api_gateway: 'healthy',
    user_service: 'healthy',
    campaign_service: 'healthy',
    pledge_service: 'degraded',
    payment_service: 'healthy',
    notification_service: 'healthy',
  });

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring & Observability</h1>
          <p className="mt-2 text-gray-600">Monitor system health and performance</p>
        </div>

        {/* Service Health Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Service Health Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(serviceHealth).map(([service, status]) => (
              <div key={service} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 capitalize">
                    {service.replace('_', ' ')}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${getHealthColor(status)}`} />
                </div>
                <span className="text-sm text-gray-600 capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Dashboards */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Request Rate</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Grafana Panel: Request Rate</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Error Rate</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Grafana Panel: Error Rate</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Database CPU</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Grafana Panel: DB CPU</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Queue Depth</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Grafana Panel: Queue Depth</p>
            </div>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Errors</h2>
          <div className="space-y-2">
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm font-semibold text-red-900">Payment processing failed</p>
              <p className="text-xs text-red-700 mt-1">2 minutes ago - Payment Service</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-sm font-semibold text-yellow-900">High response time detected</p>
              <p className="text-xs text-yellow-700 mt-1">15 minutes ago - Campaign Service</p>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Open Grafana Dashboard
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
            >
              Open Jaeger Traces
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
            >
              View Logs
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Monitoring;

