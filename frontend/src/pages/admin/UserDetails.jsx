import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import api from '../../services/api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]); // Will be populated when Pledge Service is available

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch user basic info
        const userData = await api.users.getUserById(id);
        console.log('User data received:', userData);
        
        // Ensure user object has required fields with defaults
        setUser({
          id: userData.id,
          name: userData.name || 'Unknown',
          email: userData.email || 'N/A',
          phone: userData.phone || null,
          role: userData.role || 'user',
          status: userData.status || 'active',
          email_verified: userData.email_verified || false,
          created_at: userData.created_at,
          last_login: userData.last_login || null,
        });

        // Fetch campaigns created by this user
        // Note: Campaign Service doesn't have a filter by created_by endpoint yet
        // For now, we'll fetch all campaigns and filter client-side
        try {
          const allCampaigns = await api.campaigns.list({});
          const userCampaignsList = allCampaigns.filter(
            campaign => campaign.created_by === id
          );
          setUserCampaigns(userCampaignsList);
        } catch (error) {
          console.error('Failed to fetch user campaigns:', error);
          setUserCampaigns([]);
        }

        // TODO: Fetch donations when Pledge Service is available
        // const donationsData = await api.pledges.getByUserId(id);
        // setDonations(donationsData || []);

        // Mock donations data for now (remove when Pledge Service is available)
        setDonations([
          { id: '1', amount: 50, campaign_title: 'Help Build a School', campaign_id: '1', date: '2024-11-15T10:30:00Z' },
          { id: '2', amount: 25, campaign_title: 'Emergency Medical Fund', campaign_id: '2', date: '2024-11-10T14:20:00Z' },
          { id: '3', amount: 100, campaign_title: 'Food & Shelter', campaign_id: '3', date: '2024-11-05T09:15:00Z' },
        ]);

      } catch (error) {
        console.error('Failed to fetch user details:', error);
        console.error('Error details:', error);
        // Don't navigate immediately, show error state
        setUser(null);
        toast.error('Failed to load user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id, navigate]);

  const handleBlockUser = async () => {
    if (window.confirm(`Are you sure you want to ${user?.status === 'blocked' ? 'unblock' : 'block'} this user?`)) {
      // TODO: Replace with actual API call
      toast.success(`User ${user?.status === 'blocked' ? 'unblocked' : 'blocked'} successfully`);
      // Refresh user data
      // const updatedUser = await api.users.getUserById(id);
      // setUser(updatedUser);
    }
  };

  const handleResetPassword = async () => {
    if (window.confirm('Send password reset email to this user?')) {
      // TODO: Replace with actual API call
      toast.success('Password reset email sent successfully');
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete the user account. This action cannot be undone. Are you sure?')) {
      // TODO: Replace with actual API call
      toast.success('User deleted successfully');
      navigate('/admin/users');
    }
  };

  const handleEditUser = () => {
    // TODO: Open edit modal or navigate to edit page
    toast.info('Edit user feature coming soon');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!loading && !user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-lg mb-2">User not found</p>
            <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or couldn't be loaded.</p>
            <Link
              to="/admin/users"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ← Back to Users
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return null; // Still loading
  }

  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalRaisedFromCampaigns = userCampaigns.reduce(
    (sum, c) => sum + (parseFloat(c.total_raised || 0)), 0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/users"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              <p className="mt-1 text-gray-600">View and manage user account</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              🔑 Reset Password
            </button>
            <button
              onClick={handleBlockUser}
              className={`px-4 py-2 rounded-lg font-semibold ${
                user.status === 'blocked'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {user.status === 'blocked' ? '✓ Unblock' : '🚫 Block'}
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* 1. User Basic Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name || 'N/A'}</h3>
                <p className="text-gray-600">{user.email || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Phone Number</span>
                <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. User Account Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-gray-500">User ID</span>
              <p className="text-gray-900 font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Account Type</span>
              <p className="text-gray-900 font-medium">
                {user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizer' : 'Donor'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Account Status</span>
              <p className="text-gray-900 font-medium">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.status === 'blocked' || user.status === 'suspended'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.status === 'blocked' ? 'Blocked' : user.status === 'suspended' ? 'Suspended' : 'Active'}
                </span>
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email Verified</span>
              <p className="text-gray-900 font-medium">
                {user.email_verified ? (
                  <span className="text-green-600 font-semibold">✓ Yes</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">✗ No</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Joined Date</span>
              <p className="text-gray-900 font-medium">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Last Login Time</span>
              <p className="text-gray-900 font-medium">{formatDate(user.last_login) || 'Never'}</p>
            </div>
          </div>
        </div>

        {/* 3. Donation-Related Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Activity</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <span className="text-sm text-gray-600">Total Donations Made</span>
              <p className="text-2xl font-bold text-blue-600">{donations.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <span className="text-sm text-gray-600">Total Amount Donated</span>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDonations)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <span className="text-sm text-gray-600">Donation Count</span>
              <p className="text-2xl font-bold text-purple-600">{donations.length}</p>
            </div>
          </div>

          {donations.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.slice(0, 5).map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <Link
                            to={`/campaigns/${donation.campaign_id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {donation.campaign_title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(donation.date)}</td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            to={`/admin/donations?donation_id=${donation.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No donations found</p>
            </div>
          )}
        </div>

        {/* 4. Campaign Organizer Info */}
        {userCampaigns.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Organizer Info</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <span className="text-sm text-gray-600">Campaigns Created</span>
                <p className="text-2xl font-bold text-purple-600">{userCampaigns.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <span className="text-sm text-gray-600">Total Raised</span>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRaisedFromCampaigns)}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <span className="text-sm text-gray-600">Active Campaigns</span>
                <p className="text-2xl font-bold text-blue-600">
                  {userCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaigns List</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raised</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userCampaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{campaign.title}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'completed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          {formatCurrency(campaign.total_raised || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatCurrency(campaign.target_amount || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            to={`/admin/campaigns/${campaign.id}/edit`}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. Role / Permission Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Role & Permissions</h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Current Role</span>
              <p className="text-gray-900 font-medium">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : user.role === 'organizer'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizer' : 'Donor'}
                </span>
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Permissions</span>
              <div className="mt-2 space-y-2">
                {user.role === 'admin' && (
                  <>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-2">Full Access</span>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-2">Manage Users</span>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-2">Manage Campaigns</span>
                  </>
                )}
                {user.role === 'organizer' && (
                  <>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs mr-2">Create Campaigns</span>
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs mr-2">Manage Own Campaigns</span>
                  </>
                )}
                {(!user.role || user.role === 'user' || user.role === 'donor') && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs mr-2">Make Donations</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetails;

