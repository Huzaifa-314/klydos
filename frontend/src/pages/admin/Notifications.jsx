import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    target: 'all',
  });

  const handleSendAnnouncement = () => {
    // TODO: Replace with actual API call
    toast.success('Announcement sent successfully');
    setAnnouncementForm({ title: '', message: '', target: 'all' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Messaging</h1>
          <p className="mt-2 text-gray-600">Send announcements and manage email templates</p>
        </div>

        {/* Send Announcement */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Send Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement message"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
              <select
                value={announcementForm.target}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, target: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="donors">Donors Only</option>
                <option value="organizers">Organizers Only</option>
              </select>
            </div>
            <button
              onClick={handleSendAnnouncement}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
            >
              Send Announcement
            </button>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Email Templates</h2>
          <div className="space-y-4">
            {['Receipt', 'Refund', 'Campaign Approved', 'Campaign Rejected'].map((template) => (
              <div
                key={template}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-900">{template}</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                  Edit Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;

