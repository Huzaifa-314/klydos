import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const prefillAmount = location.state?.amount;

  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState(prefillAmount || '');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    anonymous: false,
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual API call when Campaign Service is available
  // API Endpoint (Future): GET /api/campaigns/:id
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Mock campaign data - Replace with: api.campaigns.getById(id)
      const mockCampaign = {
        id: parseInt(id) || 1,
        title: 'Help Build a School in Rural Area',
        description: 'Support education for underprivileged children by helping us build a school in a remote village.',
        target_amount: 50000,
        total_raised: 32000,
        total_donors: 145,
        photos: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
        end_date: '2024-12-31',
      };
      setCampaign(mockCampaign);
      setLoading(false);
    }, 500);
  }, [id]);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setDonorInfo({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        anonymous: false,
      });
    }
  }, [isAuthenticated, user]);

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDonationAmount(value);
    }
  };

  const handleQuickAmount = (amount) => {
    setDonationAmount(amount.toString());
  };

  const handleDonorInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!donationAmount || parseFloat(donationAmount) < 1) {
      newErrors.amount = 'Minimum donation amount is $1';
    }

    if (!donorInfo.name.trim() && !donorInfo.anonymous) {
      newErrors.name = 'Name is required unless donating anonymously';
    }

    if (!donorInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(donorInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateFees = () => {
    const amount = parseFloat(donationAmount) || 0;
    const platformFee = amount * 0.029; // 2.9% platform fee
    const processingFee = amount * 0.01; // 1% processing fee
    const total = amount + platformFee + processingFee;
    return {
      amount,
      platformFee,
      processingFee,
      total,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Replace with actual API call when Pledge Service is available
    // API Endpoint (Future): POST /api/campaigns/:id/pledge
    setTimeout(() => {
      // Replace with: api.pledges.create(campaign.id, donationData)
      const fees = calculateFees();
      const donationData = {
        campaign_id: campaign.id,
        amount: fees.amount,
        donor_name: donorInfo.anonymous ? 'Anonymous' : donorInfo.name,
        donor_email: donorInfo.email,
        donor_phone: donorInfo.phone || undefined,
        anonymous: donorInfo.anonymous,
        payment_method: paymentMethod,
        total_amount: fees.total,
      };

      console.log('Donation data:', donationData);

      // Redirect to payment gateway or show success
      // For now, redirect to campaign details with success message
      setIsSubmitting(false);
      navigate(`/campaigns/${campaign.id}`, {
        state: { donationSuccess: true, amount: fees.amount },
      });
    }, 1000);
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

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-8">The campaign you're looking for doesn't exist.</p>
          <Link to="/campaigns" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Browse Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progress = campaign.total_raised > 0 
    ? Math.min((campaign.total_raised / campaign.target_amount) * 100, 100) 
    : 0;

  const daysLeft = calculateDaysLeft(campaign.end_date);
  const fees = calculateFees();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={`/campaigns/${campaign.id}`} className="text-blue-600 hover:text-blue-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Campaign
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Campaign Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Summary</h2>
              <div className="flex gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden flex-shrink-0">
                  {campaign.photos && campaign.photos.length > 0 ? (
                    <img
                      src={campaign.photos[0]}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-900">
                        ${campaign.total_raised.toLocaleString()}
                      </span>
                      <span className="text-gray-600">
                        of ${campaign.target_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{daysLeft} days left</span> • {campaign.total_donors} donors
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Donation Amount Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation Amount</h2>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[10, 20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      donationAmount === amount.toString()
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">$</span>
                  <input
                    id="amount"
                    type="text"
                    value={donationAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold ${
                      errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.amount}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">Minimum donation: $1</p>
              </div>
            </div>

            {/* 3. Donor Information Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Donor Information</h2>
              <form className="space-y-4">
                {/* Anonymous Checkbox */}
                <div className="flex items-center">
                  <input
                    id="anonymous"
                    name="anonymous"
                    type="checkbox"
                    checked={donorInfo.anonymous}
                    onChange={handleDonorInfoChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                    Donate as Anonymous
                  </label>
                </div>

                {/* Full Name */}
                {!donorInfo.anonymous && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={donorInfo.name}
                      onChange={handleDonorInfoChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={donorInfo.email}
                    onChange={handleDonorInfoChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={donorInfo.phone}
                    onChange={handleDonorInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
              </form>
            </div>

            {/* 4. Payment Method Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { value: 'mobile', label: 'Mobile Payment', icon: '📱' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-2xl mr-3">{method.icon}</span>
                    <span className="text-gray-900 font-medium">{method.label}</span>
                  </label>
                ))}
                <p className="text-sm text-gray-500 mt-4">
                  You will be redirected to a secure payment gateway to complete your donation.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Donation Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {/* 5. Donation Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donation Amount</span>
                    <span className="font-semibold text-gray-900">
                      ${fees.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Platform Fee (2.9%)</span>
                    <span className="text-gray-600">${fees.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Processing Fee (1%)</span>
                    <span className="text-gray-600">${fees.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${fees.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!donationAmount || parseFloat(donationAmount) < 1 || isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

