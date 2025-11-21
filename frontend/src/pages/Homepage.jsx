import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import api from '../services/api';
import toast from 'react-hot-toast';

const Homepage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonors: 0,
    totalRaised: 0,
    activeDonors: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all campaigns
        const allCampaigns = await api.campaigns.list({ status: 'active' });
        setCampaigns(allCampaigns || []);
        
        // Fetch featured campaigns
        const featured = await api.campaigns.list({ featured: true, status: 'active' });
        setFeaturedCampaigns(featured || []);
        
        // Calculate stats from campaigns
        // Note: Campaign Service returns campaigns with summary data
        const totalRaised = allCampaigns?.reduce((sum, c) => {
          return sum + (parseFloat(c.campaign_summary?.total_raised || 0));
        }, 0) || 0;
        
        const totalDonors = allCampaigns?.reduce((sum, c) => {
          return sum + (parseInt(c.campaign_summary?.total_donors || 0));
        }, 0) || 0;
        
        setStats({
          totalCampaigns: allCampaigns?.length || 0,
          totalDonors: totalDonors,
          totalRaised: totalRaised,
          activeDonors: Math.floor(totalDonors * 0.1), // Estimate active donors
        });

        // Mock recent donations (will be replaced when Pledge Service is available)
        const mockDonations = [
          { name: 'Ayesha', amount: 20 },
          { name: 'Rahim', amount: 5 },
          { name: 'Sara', amount: 50 },
          { name: 'Mohammed', amount: 100 },
          { name: 'Fatima', amount: 25 },
          { name: 'Ali', amount: 15 },
          { name: 'Hassan', amount: 75 },
          { name: 'Zainab', amount: 30 },
        ];
        setRecentDonations(mockDonations);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          stack: error.stack,
        });
        
        // Set empty state on error
        setCampaigns([]);
        setFeaturedCampaigns([]);
        setStats({
          totalCampaigns: 0,
          totalDonors: 0,
          totalRaised: 0,
          activeDonors: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    if (featuredCampaigns.length > 0) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredCampaigns.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredCampaigns.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Donor',
      text: 'CareForAll made it so easy to support causes I care about. The transparency and impact tracking are amazing!',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Campaign Organizer',
      text: 'The platform helped us reach so many donors and exceed our fundraising goal. Thank you CareForAll!',
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Donor',
      text: 'I love seeing exactly where my donations go and the real impact they make. Highly recommend!',
      avatar: 'ER',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V4h4V2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V4h4V2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Make a Difference,
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              One Donation at a Time
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of compassionate donors supporting life-changing campaigns around the world
          </p>
          <div className="flex justify-center items-center">
            <Link
              to="/campaigns"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            > 
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Marquee - Recent Donations Feed */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-4 overflow-hidden border-y border-blue-100">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...recentDonations, ...recentDonations].map((donation, idx) => (
              <span key={idx} className="marquee-item">
                <span className="font-semibold text-blue-600">{donation.name}</span>
                {' '}donated <span className="font-bold text-green-600">${donation.amount}</span>
                <span className="mx-4 text-gray-300">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Campaigns Slider */}
      {featuredCampaigns.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Campaigns
              </h2>
              <p className="text-lg text-gray-600">
                Urgent causes that need your support right now
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentFeaturedIndex * 100}%)` }}
                >
                  {featuredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="min-w-full">
                      <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                        <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden">
                          {campaign.photos && campaign.photos.length > 0 ? (
                            <img
                              src={campaign.photos[0]}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                            {campaign.category}
                          </span>
                          <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            {campaign.title}
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {campaign.description}
                          </p>
                          <div className="mb-6">
                            <div className="flex justify-between mb-2">
                              <span className="text-lg font-bold text-gray-900">
                                ${parseFloat(campaign.campaign_summary?.total_raised || campaign.total_raised || 0).toLocaleString()}
                              </span>
                              <span className="text-gray-600">
                                of ${parseFloat(campaign.target_amount || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                                style={{ width: `${Math.min((parseFloat(campaign.campaign_summary?.total_raised || campaign.total_raised || 0) / parseFloat(campaign.target_amount || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Donate Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex justify-center gap-2 mt-6">
                {featuredCampaigns.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFeaturedIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentFeaturedIndex
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. All Campaigns Preview Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All Campaigns
              </h2>
              <p className="text-lg text-gray-600">
                Discover all active fundraising campaigns
              </p>
            </div>
            <Link
              to="/campaigns"
              className="hidden md:block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Campaigns Available</h3>
              <p className="text-gray-600 mb-6">There are no campaigns available at the moment. Please check back later.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {campaigns.slice(0, 6).map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
              <div className="text-center md:hidden">
                <Link
                  to="/campaigns"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View All Campaigns
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Making a difference is just three simple steps away
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose a Campaign',
                description: 'Browse through our verified campaigns and find a cause that resonates with you.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '2',
                title: 'Donate Securely',
                description: 'Make a secure donation using our encrypted payment system powered by Stripe.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
              {
                step: '3',
                title: 'Make an Impact',
                description: 'Track the real-time impact of your donation and see how it changes lives.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold text-gray-300 mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Impact / Platform Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-blue-100">
              Together, we're making a real difference
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stats.totalCampaigns, label: 'Total Campaigns', icon: '📋' },
              { value: stats.totalDonors.toLocaleString(), label: 'Total Donors', icon: '👥' },
              { value: `$${stats.totalRaised.toLocaleString()}`, label: 'Total Raised', icon: '💰' },
              { value: stats.activeDonors, label: 'Active Donors', icon: '⭐' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Slider */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from real people making a difference
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="min-w-full px-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 md:p-12 rounded-2xl text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                        {testimonial.avatar}
                      </div>
                      <p className="text-xl text-gray-700 mb-6 italic">
                        "{testimonial.text}"
                      </p>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonialIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentTestimonialIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Partners / Sponsors Logos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by leading organizations worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-24 hover:opacity-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-4xl font-bold text-gray-400">
                  Logo {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles for Marquee */}
      <style>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        .marquee-item {
          display: inline-block;
          margin-right: 2rem;
          font-size: 0.95rem;
          color: #4b5563;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Homepage;

