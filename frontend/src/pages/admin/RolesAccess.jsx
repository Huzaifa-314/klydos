import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const RolesAccess = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', role: 'moderator' });

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/admins
    setTimeout(() => {
      setAdmins([
        {
          id: 1,
          email: 'admin@example.com',
          role: 'super_admin',
          created_at: '2024-01-15',
        },
        {
          id: 2,
          email: 'finance@example.com',
          role: 'finance',
          created_at: '2024-02-20',
        },
        {
          id: 3,
          email: 'moderator@example.com',
          role: 'moderator',
          created_at: '2024-03-10',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddAdmin = () => {
    // TODO: Replace with actual API call
    toast.success('Admin added successfully');
    setShowAddModal(false);
    setNewAdmin({ email: '', role: 'moderator' });
  };

  const handleDeleteAdmin = (adminId) => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      // TODO: Replace with actual API call
      toast.success('Admin removed successfully');
    }
  };

  const roles = {
    super_admin: 'Super Admin',
    finance: 'Finance',
    moderator: 'Moderator',
    support: 'Support',
  };

  const permissions = {
    super_admin: ['All permissions'],
    finance: ['View donations', 'Process refunds', 'View reports'],
    moderator: ['Manage campaigns', 'Verify campaigns', 'Manage users'],
    support: ['View tickets', 'Reply to tickets', 'View users'],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role & Access Management</h1>
            <p className="mt-2 text-gray-600">Manage admin accounts and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
          >
            ➕ Add Admin
          </button>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admins...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                          {roles[admin.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <ul className="list-disc list-inside">
                          {permissions[admin.role].map((perm, idx) => (
                            <li key={idx} className="text-xs">
                              {perm}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Permission Matrix */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Permission Matrix</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Capability</th>
                  {Object.values(roles).map((role) => (
                    <th key={role} className="px-4 py-2 text-center">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  'Manage Campaigns',
                  'Process Refunds',
                  'Manage Users',
                  'View Reports',
                  'Manage Settings',
                  'View Audit Logs',
                ].map((capability) => (
                  <tr key={capability} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm font-medium">{capability}</td>
                    {Object.keys(roles).map((role) => (
                      <td key={role} className="px-4 py-2 text-center">
                        {role === 'super_admin' || (role === 'finance' && capability.includes('Refund')) ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(roles).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RolesAccess;

