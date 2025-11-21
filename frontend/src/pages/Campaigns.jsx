import { useState, useEffect } from 'react';
import CampaignCard from '../components/CampaignCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await api.campaigns.list({ status: 'active' });
        setCampaigns(data || []);
        setFilteredCampaigns(data || []);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        toast.error('Failed to load campaigns. Please try again later.');
        setCampaigns([]);
        setFilteredCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter and sort campaigns
  useEffect(() => {
    let filtered = [...campaigns];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((campaign) => campaign.category === selectedCategory);
    }

    // Sort campaigns
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'most-funded':
        filtered.sort((a, b) => {
          const aRaised = parseFloat(a.campaign_summary?.total_raised || a.total_raised || 0);
          const bRaised = parseFloat(b.campaign_summary?.total_raised || b.total_raised || 0);
          return bRaised - aRaised;
        });
        break;
      case 'least-funded':
        filtered.sort((a, b) => {
          const aRaised = parseFloat(a.campaign_summary?.total_raised || a.total_raised || 0);
          const bRaised = parseFloat(b.campaign_summary?.total_raised || b.total_raised || 0);
          return aRaised - bRaised;
        });
        break;
      case 'most-donors':
        filtered.sort((a, b) => {
          const aDonors = parseInt(a.campaign_summary?.total_donors || a.total_donors || 0);
          const bDonors = parseInt(b.campaign_summary?.total_donors || b.total_donors || 0);
          return bDonors - aDonors;
        });
        break;
      default:
        break;
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchQuery, selectedCategory, sortBy]);

  const categories = ['all', 'Medical', 'Education', 'Emergency', 'Food & Shelter'];
  const uniqueCategories = [...new Set(campaigns.map((c) => c.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Campaigns</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover and support causes that matter to you
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'most-funded', label: 'Most Funded' },
                { value: 'least-funded', label: 'Least Funded' },
                { value: 'most-donors', label: 'Most Donors' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCampaigns.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{campaigns.length}</span> campaigns
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no campaigns available at the moment.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;

