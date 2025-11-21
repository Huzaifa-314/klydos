import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const PaymentsGateway = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchIdempotency, setSearchIdempotency] = useState('');
  const [searchPaymentId, setSearchPaymentId] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/webhooks
    setTimeout(() => {
      setWebhooks([
        {
          id: 1,
          event_type: 'payment.succeeded',
          payload: { payment_id: 'ch_1234567890', amount: 100 },
          outcome: 'success',
          created_at: '2024-11-20T10:30:00Z',
        },
        {
          id: 2,
          event_type: 'payment.failed',
          payload: { payment_id: 'ch_0987654321', amount: 50 },
          outcome: 'failed',
          created_at: '2024-11-20T09:15:00Z',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleRetryWebhook = (webhookId) => {
    // TODO: Replace with actual API call
    toast.success('Webhook retry initiated');
  };

  const handleReconcile = () => {
    // TODO: Replace with actual API call
    toast.success('Reconciliation completed');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Gateway Tools</h1>
          <p className="mt-2 text-gray-600">Manage payment gateway webhooks and tools</p>
        </div>

        {/* Search Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Search Payment ID</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchPaymentId}
                onChange={(e) => setSearchPaymentId(e.target.value)}
                placeholder="Enter payment ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleReconcile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Search Idempotency Key</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchIdempotency}
                onChange={(e) => setSearchIdempotency(e.target.value)}
                placeholder="Enter idempotency key"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Webhook Logs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Webhook Logs</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading webhooks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{webhook.event_type}</span>
                      <span
                        className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          webhook.outcome === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {webhook.outcome}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(webhook.created_at).toLocaleString()}
                    </span>
                  </div>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto mb-2">
                    {JSON.stringify(webhook.payload, null, 2)}
                  </pre>
                  {webhook.outcome === 'failed' && (
                    <button
                      onClick={() => handleRetryWebhook(webhook.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      Retry Webhook
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentsGateway;

