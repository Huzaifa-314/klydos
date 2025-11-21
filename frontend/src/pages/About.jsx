import { useState, useEffect } from 'react';

const About = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonors: 0,
    totalRaised: 0,
    campaignsSupported: 0,
  });

  useEffect(() => {
    // Mock stats - replace with actual API call: GET /stats
    setTimeout(() => {
      setStats({
        totalCampaigns: 150,
        totalDonors: 12500,
        totalRaised: 2500000,
        campaignsSupported: 120,
      });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About CareForAll</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Connecting compassionate donors with life-changing causes and ensuring every donation creates real impact.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 1. Mission Statement */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                We exist to connect donors with life-changing causes and ensure every donation creates real impact. 
                Our platform bridges the gap between those who want to help and those who need it most, 
                making charitable giving transparent, secure, and meaningful.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Our Story */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="prose max-w-none text-gray-700 space-y-6">
              <p className="text-lg leading-relaxed">
                CareForAll was born from a simple observation: while millions of people want to make a difference 
                in the world, finding trustworthy and impactful ways to donate can be challenging. Traditional 
                charity platforms often lack transparency, making it difficult for donors to see where their 
                contributions actually go.
              </p>
              <p className="text-lg leading-relaxed">
                We saw a need for a platform that combines modern technology with genuine compassion—a place where 
                every campaign is verified, every donation is tracked, and every impact is visible. Our founders, 
                driven by personal experiences with charitable giving, set out to create a solution that would 
                revolutionize how people support causes they care about.
              </p>
              <p className="text-lg leading-relaxed">
                Today, CareForAll stands as a testament to what's possible when technology meets humanity. 
                We believe that everyone deserves access to help when they need it most, and that every donor 
                deserves to see the real difference their contribution makes.
              </p>
            </div>

            {/* Values */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Transparency',
                  description: 'Every donation is tracked and visible, ensuring complete transparency in how funds are used.',
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ),
                },
                {
                  title: 'Trust',
                  description: 'All campaigns are verified before going live, ensuring donors can give with confidence.',
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: 'Impact',
                  description: 'We focus on measurable outcomes, ensuring every contribution creates tangible change.',
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
              ].map((value, idx) => (
                <div key={idx} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. What We Do */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Safe Online Donations',
                  description: 'We use industry-leading encryption and secure payment processing through Stripe to ensure your financial information is always protected.',
                  icon: '🔒',
                },
                {
                  title: 'Transparent Tracking',
                  description: 'Every donation is tracked in real-time. You can see exactly how much has been raised and how your contribution is being used.',
                  icon: '📊',
                },
                {
                  title: 'Verified Campaigns',
                  description: 'All campaigns go through a rigorous verification process before going live, ensuring legitimacy and accountability.',
                  icon: '✅',
                },
                {
                  title: 'Direct Support',
                  description: 'We support a wide range of causes including medical emergencies, educational initiatives, disaster relief, and basic needs like food and shelter.',
                  icon: '💝',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-4xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. How the Platform Works */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Campaigns Added & Verified',
                  description: 'Campaign organizers submit their causes, which our team verifies for legitimacy and need.',
                },
                {
                  step: '2',
                  title: 'Donors Choose a Cause',
                  description: 'Browse through verified campaigns and select the cause that resonates with you.',
                },
                {
                  step: '3',
                  title: 'Payments Processed Safely',
                  description: 'Make secure donations using our encrypted payment system powered by Stripe.',
                },
                {
                  step: '4',
                  title: 'Donations Tracked in Real-Time',
                  description: 'Watch as campaigns progress toward their goals with transparent, real-time updates.',
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Why Trust Us */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Why Trust Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Secure Payment Gateway',
                  description: 'We partner with Stripe, a globally recognized payment processor trusted by millions of businesses worldwide. Your payment information is never stored on our servers.',
                },
                {
                  title: 'Transparent Reporting',
                  description: 'Every campaign provides regular updates on how funds are being used. Donors can see exactly where their money goes and the impact it creates.',
                },
                {
                  title: 'Verified Campaigns',
                  description: 'All campaigns undergo a thorough verification process. We verify identity, need, and legitimacy before any campaign goes live on our platform.',
                },
                {
                  title: 'Active Monitoring & Fraud Prevention',
                  description: 'Our team actively monitors all campaigns for suspicious activity. We have robust fraud prevention measures in place to protect both donors and beneficiaries.',
                },
                {
                  title: 'Real-Time Tracking',
                  description: 'Donations are tracked in real-time with complete transparency. You can see progress bars, donor counts, and campaign updates as they happen.',
                },
                {
                  title: 'Dedicated Support',
                  description: 'Our support team is available to answer questions, address concerns, and ensure a smooth experience for all users.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Team (Optional) */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Co-Founder & CEO',
                  description: 'Passionate about making charitable giving accessible and transparent.',
                  avatar: 'SJ',
                },
                {
                  name: 'Michael Chen',
                  role: 'Co-Founder & CTO',
                  description: 'Building secure and scalable technology solutions for social good.',
                  avatar: 'MC',
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Head of Operations',
                  description: 'Ensuring every campaign meets our high standards of verification and impact.',
                  avatar: 'ER',
                },
              ].map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Impact Highlights */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: stats.totalCampaigns.toLocaleString(), label: 'Total Campaigns', icon: '📋' },
                { value: stats.totalDonors.toLocaleString(), label: 'Total Donors', icon: '👥' },
                { value: `$${stats.totalRaised.toLocaleString()}`, label: 'Total Raised', icon: '💰' },
                { value: stats.campaignsSupported.toLocaleString(), label: 'Campaigns Supported', icon: '✅' },
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

        {/* Call to Action */}
        <section>
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Us in Making a Difference</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Every donation counts. Together, we can create lasting change and support those in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/campaigns"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Browse Campaigns
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

