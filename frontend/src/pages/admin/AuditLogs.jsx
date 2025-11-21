import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/audit-logs
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          action: 'campaign.created',
          admin: 'admin@example.com',
          target_type: 'campaign',
          target_id: 101,
          details: 'Created campaign "Help Build a School"',
          timestamp: '2024-11-20T10:30:00Z',
        },
        {
          id: 2,
          action: 'donation.refunded',
          admin: 'admin@example.com',
          target_type: 'donation',
          target_id: 201,
          details: 'Refunded $200 for donation #201',
          timestamp: '2024-11-20T09:15:00Z',
        },
        {
          id: 3,
          action: 'user.blocked',
          admin: 'admin@example.com',
          target_type: 'user',
          target_id: 301,
          details: 'Blocked user john@example.com',
          timestamp: '2024-11-19T16:45:00Z',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredLogs = filterType === 'all' ? logs : logs.filter((log) => log.target_type === filterType);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="mt-2 text-gray-600">Immutable activity trail of admin actions</p>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            <option value="campaign">Campaigns</option>
            <option value="donation">Donations</option>
            <option value="user">Users</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading audit logs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.admin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.target_type} #{log.target_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;

