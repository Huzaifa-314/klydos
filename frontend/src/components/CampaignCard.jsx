import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Campaign Service returns total_raised and total_donors directly on the campaign object
  const totalRaised = parseFloat(campaign.total_raised || 0);
  const totalDonors = parseInt(campaign.total_donors || 0);
  const targetAmount = parseFloat(campaign.target_amount || 0);
  
  const progress = totalRaised > 0 && targetAmount > 0
    ? Math.min((parseFloat(totalRaised) / targetAmount) * 100, 100) 
    : 0;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the donate button or arrow buttons
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleDonateClick = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/campaigns/${campaign.id}/checkout`);
  };

  const handlePreviousImage = (e) => {
    e.stopPropagation(); // Prevent card click
    if (campaign.photos && campaign.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + campaign.photos.length) % campaign.photos.length);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); // Prevent card click
    if (campaign.photos && campaign.photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % campaign.photos.length);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Campaign Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden group/image">
        {campaign.photos && campaign.photos.length > 0 ? (
          <>
            <img
              src={campaign.photos[currentImageIndex] || campaign.photos[0]}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Arrow Navigation - Only show if multiple photos */}
            {campaign.photos.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="Previous image"
                  type="button"
                >
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Next Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10"
                  aria-label="Next image"
                  type="button"
                >
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image Indicator Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {campaign.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'bg-white w-4'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {campaign.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-900">
              ${parseFloat(totalRaised).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              of ${targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {totalDonors} donors
            </span>
            <span className="text-xs font-semibold text-gray-700">
              {progress.toFixed(0)}% funded
            </span>
          </div>
        </div>

        {/* Donate Button */}
        <button
          onClick={handleDonateClick}
          className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;

