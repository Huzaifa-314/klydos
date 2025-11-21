import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const RefundsChargebacks = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/refunds
    setTimeout(() => {
      setRefunds([
        {
          id: 1,
          donation_id: 101,
          amount: 200,
          reason: 'Donor request',
          status: 'pending',
          requested_by: 'admin@example.com',
          created_at: '2024-11-20T10:30:00Z',
        },
        {
          id: 2,
          donation_id: 102,
          amount: 50,
          reason: 'Payment error',
          status: 'completed',
          requested_by: 'system',
          created_at: '2024-11-19T15:20:00Z',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleProcessRefund = (refundId) => {
    // TODO: Replace with actual API call
    toast.success('Refund processed successfully');
  };

  const handleBulkRefund = () => {
    // TODO: Replace with actual API call
    toast.success('Bulk refund initiated');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Refunds & Chargebacks</h1>
            <p className="mt-2 text-gray-600">Manage refund requests and chargebacks</p>
          </div>
          <button
            onClick={handleBulkRefund}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            Bulk Process Refunds
          </button>
        </div>

        {/* Refund Queue */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b border-gray-200">Refund Queue</h2>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading refunds...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refund ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donation ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {refunds.map((refund) => (
                    <tr key={refund.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{refund.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        #{refund.donation_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${refund.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{refund.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            refund.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : refund.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {refund.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {refund.requested_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(refund.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {refund.status === 'pending' && (
                          <button
                            onClick={() => handleProcessRefund(refund.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Process Refund
                          </button>
                        )}
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

export default RefundsChargebacks;

