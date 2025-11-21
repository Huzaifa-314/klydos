import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CampaignsManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Fetch all campaigns (admin can see all statuses)
        const data = await api.campaigns.list({});
        
        // Transform API response to match component expectations
        const transformedCampaigns = (data || []).map(campaign => ({
          id: campaign.id,
          title: campaign.title,
          category: campaign.category || 'Uncategorized',
          goal: parseFloat(campaign.target_amount || 0),
          raised: parseFloat(campaign.campaign_summary?.total_raised || 0),
          status: campaign.status,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          organizer: campaign.created_by ? 'User' : 'System',
          verified: campaign.status === 'active', // Consider active campaigns as verified
        }));
        
        setCampaigns(transformedCampaigns);
        setFilteredCampaigns(transformedCampaigns);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        toast.error('Failed to load campaigns');
        setCampaigns([]);
        setFilteredCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    let filtered = [...campaigns];

    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchQuery, statusFilter, categoryFilter]);

  const handleBulkAction = (action) => {
    if (selectedCampaigns.length === 0) {
      toast.error('Please select campaigns first');
      return;
    }
    toast.success(`${action} action performed on ${selectedCampaigns.length} campaign(s)`);
    setSelectedCampaigns([]);
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      await api.campaigns.updateStatus(campaignId, newStatus);
      toast.success(`Campaign status updated to ${newStatus}`);
      
      // Refresh campaigns list
      const data = await api.campaigns.list({});
      const transformedCampaigns = (data || []).map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        category: campaign.category || 'Uncategorized',
        goal: parseFloat(campaign.target_amount || 0),
        raised: parseFloat(campaign.campaign_summary?.total_raised || 0),
        status: campaign.status,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        organizer: campaign.created_by ? 'User' : 'System',
        verified: campaign.status === 'active',
      }));
      setCampaigns(transformedCampaigns);
      setFilteredCampaigns(transformedCampaigns);
    } catch (error) {
      console.error('Failed to update campaign status:', error);
      toast.error('Failed to update campaign status');
    }
  };

  const handleVerify = (campaignId) => {
    // TODO: Replace with actual API call
    toast.success('Campaign verified successfully');
  };

  const handleDelete = (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      // TODO: Replace with actual API call: DELETE /api/campaigns/:id
      toast.success('Campaign deleted successfully');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns Management</h1>
            <p className="mt-2 text-gray-600">Manage all fundraising campaigns</p>
          </div>
          <Link
            to="/admin/campaigns/create"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ➕ Create Campaign
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Medical">Medical</option>
              <option value="Education">Education</option>
              <option value="Emergency">Emergency</option>
              <option value="Food & Shelter">Food & Shelter</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">{selectedCampaigns.length} selected</span>
              <button
                onClick={() => handleBulkAction('Verify')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Verify Selected
              </button>
              <button
                onClick={() => handleBulkAction('Export')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
              >
                Export Selected
              </button>
            </div>
          )}
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading campaigns...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No campaigns found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaigns(filteredCampaigns.map((c) => c.id));
                          } else {
                            setSelectedCampaigns([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goal / Raised
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organizer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                            } else {
                              setSelectedCampaigns(selectedCampaigns.filter((id) => id !== campaign.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {campaign.title}
                          </Link>
                          {campaign.verified && (
                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={campaign.status}
                          onChange={(e) => handleStatusChange(campaign.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border-0 ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'completed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{new Date(campaign.start_date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">
                          to {new Date(campaign.end_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.organizer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="View"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/admin/campaigns/${campaign.id}/edit`}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          {!campaign.verified && (
                            <button
                              onClick={() => handleVerify(campaign.id)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Verify"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            🗑️
                          </button>
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

export default CampaignsManagement;

