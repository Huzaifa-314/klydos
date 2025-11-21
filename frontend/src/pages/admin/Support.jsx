import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call: GET /api/admin/support-tickets
    setTimeout(() => {
      setTickets([
        {
          id: 1,
          subject: 'Unable to make donation',
          user_email: 'user@example.com',
          message: 'I tried to donate but the payment failed.',
          status: 'open',
          created_at: '2024-11-20T10:30:00Z',
        },
        {
          id: 2,
          subject: 'Campaign approval request',
          user_email: 'organizer@example.com',
          message: 'Please review my campaign submission.',
          status: 'in_progress',
          created_at: '2024-11-19T15:20:00Z',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleReply = (ticketId) => {
    // TODO: Replace with actual API call
    toast.success('Reply sent successfully');
    setReplyText('');
    setSelectedTicket(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support / Help Desk</h1>
          <p className="mt-2 text-gray-600">Manage support tickets from users and organizers</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <h2 className="text-xl font-bold p-6 border-b border-gray-200">Support Tickets</h2>
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tickets...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          ticket.status === 'open'
                            ? 'bg-red-100 text-red-800'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{ticket.user_email}</p>
                    <p className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket Details & Reply */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {selectedTicket ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedTicket.subject}</h2>
                  <p className="text-sm text-gray-600 mb-4">From: {selectedTicket.user_email}</p>
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-900">{selectedTicket.message}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your reply..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(selectedTicket.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Send Reply
                    </button>
                    <button
                      onClick={() => toast.info('Assign feature coming soon')}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
                    >
                      Assign to Staff
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Select a ticket to view details and reply
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Support;

