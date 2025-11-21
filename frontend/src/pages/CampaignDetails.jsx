import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  const [donationAmount, setDonationAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Mock data - replace with actual API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock campaign data - replace with actual API: GET /campaigns/{id}
      const mockCampaign = {
        id: parseInt(id),
        title: 'Help Build a School in Rural Area',
        description: 'Support education for underprivileged children by helping us build a school in a remote village.',
        long_description: `In a small rural village, hundreds of children walk miles every day to reach the nearest school. Many drop out due to the long distance, while others cannot afford the transportation costs. This campaign aims to build a local school that will serve over 300 children, providing them with quality education right in their community.

The school will include:
- 8 classrooms equipped with modern teaching aids
- A library with books and learning materials
- A playground for physical activities
- Clean drinking water and sanitation facilities
- Computer lab to bridge the digital divide

Your contribution will directly impact these children's futures, giving them the education they deserve and breaking the cycle of poverty in their families. Together, we can build not just a school, but a brighter future for generations to come.`,
        target_amount: 50000,
        total_raised: 32000,
        total_donors: 145,
        photos: [
          // Mock image URLs - replace with actual photo URLs from API
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800',
        ],
        category: 'Education',
        featured: true,
        start_date: '2024-01-15',
        end_date: '2024-12-31',
        location: 'Rural Village, District XYZ',
        organizer: 'Education Foundation',
        updates: [
          {
            id: 1,
            title: 'Foundation Laid Successfully!',
            content: 'We have successfully laid the foundation of the school building. The construction is progressing well and we expect to complete the structure by next month.',
            date: '2024-11-15',
            author: 'Education Foundation',
          },
          {
            id: 2,
            title: 'Reached 50% of Goal!',
            content: 'Thanks to all generous donors, we have reached 50% of our fundraising goal. Your continued support is making a real difference!',
            date: '2024-11-10',
            author: 'Education Foundation',
          },
        ],
        contributors: [
          { id: 1, name: 'Ayesha Khan', amount: 100, date: '2024-11-20T10:30:00Z', anonymous: false },
          { id: 2, name: 'Anonymous', amount: 50, date: '2024-11-20T09:15:00Z', anonymous: true },
          { id: 3, name: 'Mohammed Ali', amount: 200, date: '2024-11-19T16:45:00Z', anonymous: false },
          { id: 4, name: 'Fatima Ahmed', amount: 75, date: '2024-11-19T14:20:00Z', anonymous: false },
          { id: 5, name: 'Anonymous', amount: 150, date: '2024-11-19T11:00:00Z', anonymous: true },
          { id: 6, name: 'Hassan Raza', amount: 300, date: '2024-11-18T18:30:00Z', anonymous: false },
        ],
      };

      // Mock related campaigns - replace with actual API: GET /campaigns?category={category}&limit=4
      const mockRelated = [
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
        },
      ];

      setCampaign(mockCampaign);
      setRelatedCampaigns(mockRelated);
      setLoading(false);
    }, 100);
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleDonate = () => {
    // Navigate to checkout page with amount pre-filled
    navigate(`/campaigns/${id}/checkout`, { state: { amount: donationAmount || undefined } });
  };

  const handleQuickAmount = (amount) => {
    setDonationAmount(amount.toString());
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Support: ${campaign?.title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-8">The campaign you're looking for doesn't exist.</p>
          <Link to="/campaigns" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Browse All Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progress = campaign.total_raised > 0 
    ? Math.min((campaign.total_raised / campaign.target_amount) * 100, 100) 
    : 0;

  const daysLeft = calculateDaysLeft(campaign.end_date);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Campaign Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {campaign.title}
          </h1>
          {campaign.location && (
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {campaign.location}
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 2. Image Gallery */}
            {campaign.photos && campaign.photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={campaign.photos[currentImageIndex] || campaign.photos[0]}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                      <svg className="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Image Navigation */}
                  {campaign.photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + campaign.photos.length) % campaign.photos.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Previous image"
                      >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % campaign.photos.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Next image"
                      >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Thumbnails */}
                  {campaign.photos.length > 1 && (
                    <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
                      {campaign.photos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`${campaign.title} - Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Campaign Story */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Campaign Story</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {campaign.long_description || campaign.description}
                </p>
              </div>
            </div>

            {/* 7. Campaign Metadata */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Start Date</div>
                  <div className="text-lg font-semibold text-gray-900">{formatDate(campaign.start_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">End Date</div>
                  <div className="text-lg font-semibold text-gray-900">{formatDate(campaign.end_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Days Left</div>
                  <div className="text-lg font-semibold text-blue-600">{daysLeft} days</div>
                </div>
                {campaign.location && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="text-lg font-semibold text-gray-900">{campaign.location}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Organized By</div>
                  <div className="text-lg font-semibold text-gray-900">{campaign.organizer}</div>
                </div>
              </div>
            </div>

            {/* 6. Contributors Section */}
            {campaign.contributors && campaign.contributors.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Contributors</h2>
                <div className="space-y-4">
                  {campaign.contributors.slice(0, 10).map((contributor) => (
                    <div key={contributor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {contributor.anonymous ? 'A' : contributor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {contributor.anonymous ? 'Anonymous' : contributor.name}
                          </div>
                          <div className="text-sm text-gray-500">{getTimeAgo(contributor.date)}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">${contributor.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Updates Section */}
            {campaign.updates && campaign.updates.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Updates</h2>
                <div className="space-y-6">
                  {campaign.updates.map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-600 pl-6 pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{update.title}</h3>
                        <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{update.content}</p>
                      <div className="text-sm text-gray-500">— {update.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Share Buttons */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share This Campaign</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>

            {/* 10. Related Campaigns */}
            {relatedCampaigns.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Campaigns</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedCampaigns.map((relatedCampaign) => (
                    <CampaignCard key={relatedCampaign.id} campaign={relatedCampaign} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Sticky Donation Box */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {/* 4. Progress Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Progress</h2>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${campaign.total_raised.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-4">
                    raised of ${campaign.target_amount.toLocaleString()} goal
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{campaign.total_donors || 0} donors</span>
                    <span className="font-bold text-blue-600">{progress.toFixed(0)}% funded</span>
                  </div>
                </div>

                {/* 5. Donation Box */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Make a Donation</h3>
                  
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[10, 20, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleQuickAmount(amount)}
                        className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                          donationAmount === amount.toString()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Donate Button */}
                  <button
                    onClick={handleDonate}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Donate Now
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>

              {/* Campaign Metadata Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-500">Days Left</div>
                    <div className="font-semibold text-blue-600">{daysLeft} days</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Organizer</div>
                    <div className="font-semibold text-gray-900">{campaign.organizer}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

