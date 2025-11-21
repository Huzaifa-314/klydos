import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    campaign: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/donations
    setTimeout(() => {
      const mockDonations = [
        {
          id: 1,
          donor_name: 'Ayesha Khan',
          donor_email: 'ayesha@example.com',
          amount: 100,
          campaign_title: 'Help Build a School',
          status: 'captured',
          provider_txn_id: 'ch_1234567890',
          created_at: '2024-11-20T10:30:00Z',
          anonymous: false,
        },
        {
          id: 2,
          donor_name: 'Anonymous',
          donor_email: 'anonymous@example.com',
          amount: 50,
          campaign_title: 'Emergency Medical Fund',
          status: 'captured',
          provider_txn_id: 'ch_0987654321',
          created_at: '2024-11-20T09:15:00Z',
          anonymous: true,
        },
        {
          id: 3,
          donor_name: 'Mohammed Ali',
          donor_email: 'mohammed@example.com',
          amount: 200,
          campaign_title: 'Food & Shelter',
          status: 'authorized',
          provider_txn_id: 'ch_1122334455',
          created_at: '2024-11-19T16:45:00Z',
          anonymous: false,
        },
        {
          id: 4,
          donor_name: 'Fatima Ahmed',
          donor_email: 'fatima@example.com',
          amount: 75,
          campaign_title: 'Help Build a School',
          status: 'failed',
          provider_txn_id: null,
          created_at: '2024-11-19T14:20:00Z',
          anonymous: false,
        },
        {
          id: 5,
          donor_name: 'Hassan Raza',
          donor_email: 'hassan@example.com',
          amount: 300,
          campaign_title: 'Disaster Relief Fund',
          status: 'refunded',
          provider_txn_id: 'ch_5566778899',
          created_at: '2024-11-18T18:30:00Z',
          anonymous: false,
        },
      ];
      setDonations(mockDonations);
      setFilteredDonations(mockDonations);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...donations];

    if (filters.status !== 'all') {
      filtered = filtered.filter((d) => d.status === filters.status);
    }

    if (filters.campaign !== 'all') {
      filtered = filtered.filter((d) => d.campaign_title === filters.campaign);
    }

    setFilteredDonations(filtered);
  }, [donations, filters]);

  const handleRefund = (donationId) => {
    if (window.confirm('Are you sure you want to refund this donation?')) {
      // TODO: Replace with actual API call
      toast.success('Refund processed successfully');
    }
  };

  const handleResendReceipt = (donationId, email) => {
    // TODO: Replace with actual API call
    toast.success(`Receipt sent to ${email}`);
  };

  const handleExport = () => {
    // TODO: Replace with actual API call
    toast.success('Exporting donations...');
  };

  const getStatusBadge = (status) => {
    const styles = {
      captured: 'bg-green-100 text-green-800',
      authorized: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const uniqueCampaigns = [...new Set(donations.map((d) => d.campaign_title))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donations Management</h1>
            <p className="mt-2 text-gray-600">View and manage all donations</p>
          </div>
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-5 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="authorized">Authorized</option>
              <option value="captured">Captured</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={filters.campaign}
              onChange={(e) => setFilters({ ...filters, campaign: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Campaigns</option>
              {uniqueCampaigns.map((campaign) => (
                <option key={campaign} value={campaign}>
                  {campaign}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              placeholder="From Date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              placeholder="To Date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={filters.amountMin}
              onChange={(e) => setFilters({ ...filters, amountMin: e.target.value })}
              placeholder="Min Amount"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading donations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {donation.donor_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {donation.donor_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${donation.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{donation.campaign_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(donation.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono text-xs">
                        {donation.provider_txn_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(donation.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {donation.status === 'captured' && (
                            <button
                              onClick={() => handleRefund(donation.id)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Refund"
                            >
                              ↩️
                            </button>
                          )}
                          {donation.status === 'captured' && (
                            <button
                              onClick={() => handleResendReceipt(donation.id, donation.donor_email)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Resend Receipt"
                            >
                              📧
                            </button>
                          )}
                          {donation.status === 'authorized' && (
                            <button
                              onClick={() => toast.info('Force capture feature coming soon')}
                              className="text-green-600 hover:text-green-800"
                              title="Force Capture"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </td>
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

export default DonationsManagement;

