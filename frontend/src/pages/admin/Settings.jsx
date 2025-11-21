import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    platform_fee_percent: 5,
    min_donation_amount: 1,
    payout_schedule: 'weekly',
    maintenance_mode: false,
    google_analytics_id: '',
    sentry_dsn: '',
    smtp_host: '',
    smtp_port: 587,
  });

  const handleSave = () => {
    // TODO: Replace with actual API call
    toast.success('Settings saved successfully');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="mt-2 text-gray-600">Configure platform defaults and integrations</p>
        </div>

        {/* Platform Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Platform Defaults</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Platform Fee (%)
              </label>
              <input
                type="number"
                value={settings.platform_fee_percent}
                onChange={(e) =>
                  setSettings({ ...settings, platform_fee_percent: parseFloat(e.target.value) })
                }
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Donation Amount ($)
              </label>
              <input
                type="number"
                value={settings.min_donation_amount}
                onChange={(e) =>
                  setSettings({ ...settings, min_donation_amount: parseFloat(e.target.value) })
                }
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payout Schedule</label>
              <select
                value={settings.payout_schedule}
                onChange={(e) => setSettings({ ...settings, payout_schedule: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenance_mode: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Integrations</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.google_analytics_id}
                onChange={(e) =>
                  setSettings({ ...settings, google_analytics_id: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sentry DSN</label>
              <input
                type="text"
                value={settings.sentry_dsn}
                onChange={(e) => setSettings({ ...settings, sentry_dsn: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* SMTP Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">SMTP Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SMTP Host</label>
              <input
                type="text"
                value={settings.smtp_host}
                onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="smtp.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SMTP Port</label>
              <input
                type="number"
                value={settings.smtp_port}
                onChange={(e) =>
                  setSettings({ ...settings, smtp_port: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway Config (Read-only) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Payment Gateway Configuration</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Payment gateway settings are managed securely. Contact system administrator for changes.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;

