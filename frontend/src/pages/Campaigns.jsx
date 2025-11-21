import { useState, useEffect } from 'react';
import CampaignCard from '../components/CampaignCard';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // TODO: Replace with actual API call when Campaign Service is available
  // API Endpoint (Future): GET /api/campaigns
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Mock campaigns data - Replace with: api.campaigns.list(params)
      const mockCampaigns = [
        {
          id: 1,
          title: 'Help Build a School in Rural Area',
          description: 'Support education for underprivileged children by helping us build a school in a remote village.',
          target_amount: 50000,
          total_raised: 32000,
          total_donors: 145,
          photos: [],
          category: 'Education',
          featured: true,
          created_at: '2024-01-15',
        },
        {
          id: 2,
          title: 'Emergency Medical Fund for Cancer Treatment',
          description: 'Help save lives by supporting cancer treatment for patients who cannot afford it.',
          target_amount: 75000,
          total_raised: 45000,
          total_donors: 289,
          photos: [],
          category: 'Medical',
          featured: true,
          created_at: '2024-02-10',
        },
        {
          id: 3,
          title: 'Food & Shelter for Homeless Families',
          description: 'Provide essential food and shelter to homeless families during the winter season.',
          target_amount: 30000,
          total_raised: 18500,
          total_donors: 98,
          photos: [],
          category: 'Food & Shelter',
          featured: true,
          created_at: '2024-03-05',
        },
        {
          id: 4,
          title: 'Disaster Relief Fund',
          description: 'Support communities affected by natural disasters with immediate relief and rebuilding efforts.',
          target_amount: 100000,
          total_raised: 67000,
          total_donors: 456,
          photos: [],
          category: 'Emergency',
          featured: false,
          created_at: '2024-04-20',
        },
        {
          id: 5,
          title: 'Clean Water Initiative',
          description: 'Bring clean drinking water to communities that lack access to safe water sources.',
          target_amount: 40000,
          total_raised: 22000,
          total_donors: 167,
          photos: [],
          category: 'Emergency',
          featured: false,
          created_at: '2024-05-12',
        },
        {
          id: 6,
          title: 'Scholarship Program for Deserving Students',
          description: 'Help bright students continue their education with scholarships for higher studies.',
          target_amount: 60000,
          total_raised: 38000,
          total_donors: 203,
          photos: [],
          category: 'Education',
          featured: false,
          created_at: '2024-06-01',
        },
        {
          id: 7,
          title: 'Medical Equipment for Rural Clinic',
          description: 'Provide essential medical equipment to a rural clinic serving thousands of patients.',
          target_amount: 45000,
          total_raised: 28000,
          total_donors: 134,
          photos: [],
          category: 'Medical',
          featured: false,
          created_at: '2024-07-15',
        },
        {
          id: 8,
          title: 'Emergency Housing for Flood Victims',
          description: 'Help families who lost their homes in recent floods rebuild their lives.',
          target_amount: 80000,
          total_raised: 52000,
          total_donors: 312,
          photos: [],
          category: 'Food & Shelter',
          featured: false,
          created_at: '2024-08-10',
        },
        {
          id: 9,
          title: 'Library Books for Community Center',
          description: 'Stock a community library with books and learning materials for children and adults.',
          target_amount: 25000,
          total_raised: 15000,
          total_donors: 89,
          photos: [],
          category: 'Education',
          featured: false,
          created_at: '2024-09-05',
        },
        {
          id: 10,
          title: 'Emergency Food Distribution Program',
          description: 'Provide nutritious meals to families facing food insecurity in urban areas.',
          target_amount: 35000,
          total_raised: 21000,
          total_donors: 156,
          photos: [],
          category: 'Food & Shelter',
          featured: false,
          created_at: '2024-10-01',
        },
        {
          id: 11,
          title: 'Pediatric Care Unit Expansion',
          description: 'Expand pediatric care facilities to serve more children in need of medical attention.',
          target_amount: 90000,
          total_raised: 58000,
          total_donors: 378,
          photos: [],
          category: 'Medical',
          featured: false,
          created_at: '2024-10-15',
        },
        {
          id: 12,
          title: 'Emergency Response Vehicle Fund',
          description: 'Purchase and equip emergency response vehicles for rapid disaster response.',
          target_amount: 120000,
          total_raised: 75000,
          total_donors: 445,
          photos: [],
          category: 'Emergency',
          featured: false,
          created_at: '2024-11-01',
        },
      ];

      setCampaigns(mockCampaigns);
      setFilteredCampaigns(mockCampaigns);
      setLoading(false);
    }, 500);
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
        filtered.sort((a, b) => b.total_raised - a.total_raised);
        break;
      case 'least-funded':
        filtered.sort((a, b) => a.total_raised - b.total_raised);
        break;
      case 'most-donors':
        filtered.sort((a, b) => (b.total_donors || 0) - (a.total_donors || 0));
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

