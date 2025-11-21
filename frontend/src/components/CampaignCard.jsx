import { Link, useNavigate } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const progress = campaign.total_raised > 0 
    ? Math.min((campaign.total_raised / campaign.target_amount) * 100, 100) 
    : 0;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the donate button
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    navigate(`/campaigns/${campaign.id}`);
  };

  const handleDonateClick = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/campaigns/${campaign.id}`, { state: { scrollToDonate: true } });
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Campaign Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
        {campaign.photos && campaign.photos.length > 0 ? (
          <img
            src={campaign.photos[0]}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
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
              ${campaign.total_raised?.toLocaleString() || 0}
            </span>
            <span className="text-sm text-gray-500">
              of ${campaign.target_amount?.toLocaleString()}
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
              {campaign.total_donors || 0} donors
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

