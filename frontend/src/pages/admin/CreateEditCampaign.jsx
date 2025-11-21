import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreateEditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    location: '',
    photos: [],
    featured: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (isEditMode && id) {
        try {
          const campaignData = await api.campaigns.getById(id);
          setFormData({
            title: campaignData.title || '',
            description: campaignData.description || '',
            long_description: campaignData.long_description || campaignData.description || '',
            target_amount: campaignData.target_amount?.toString() || '',
            start_date: campaignData.start_date ? new Date(campaignData.start_date).toISOString().split('T')[0] : '',
            end_date: campaignData.end_date ? new Date(campaignData.end_date).toISOString().split('T')[0] : '',
            location: campaignData.location || '',
            photos: campaignData.photos || [],
            featured: campaignData.featured || false,
          });
        } catch (error) {
          console.error('Failed to fetch campaign:', error);
          toast.error('Failed to load campaign data');
          navigate('/admin/campaigns');
        }
      }
    };

    fetchCampaign();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // If editing and campaign has ID, upload photos immediately
    if (isEditMode && id) {
      try {
        await api.campaigns.uploadPhotos(id, files);
        toast.success(`${files.length} photo(s) uploaded successfully`);
        // Refresh campaign data to get updated photos
        const campaignData = await api.campaigns.getById(id);
        setFormData({
          ...formData,
          photos: campaignData.photos || [],
        });
      } catch (error) {
        console.error('Failed to upload photos:', error);
        toast.error('Failed to upload photos');
      }
    } else {
      // For new campaigns, store files for upload after creation
      toast.success(`${files.length} photo(s) selected`);
      setFormData({
        ...formData,
        photos: [...formData.photos, ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare campaign data for API
      const campaignData = {
        title: formData.title,
        description: formData.description,
        long_description: formData.long_description || formData.description,
        target_amount: parseFloat(formData.target_amount),
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
        location: formData.location || undefined,
        featured: formData.featured,
        status: isEditMode ? undefined : 'draft', // New campaigns start as draft
      };

      let campaignId = id;
      
      if (isEditMode) {
        // Update existing campaign
        await api.campaigns.update(id, campaignData);
        campaignId = id;
      } else {
        // Create new campaign
        const newCampaign = await api.campaigns.create(campaignData);
        campaignId = newCampaign.id;
        
        // Upload photos if any were selected
        if (formData.photos.length > 0) {
          const photoFiles = formData.photos
            .filter(p => p.file)
            .map(p => p.file);
          
          if (photoFiles.length > 0) {
            try {
              await api.campaigns.uploadPhotos(campaignId, photoFiles);
            } catch (photoError) {
              console.error('Failed to upload photos:', photoError);
              toast.error('Campaign created but photos upload failed');
            }
          }
        }
      }
      
      toast.success(`Campaign ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/campaigns');
    } catch (error) {
      console.error('Failed to save campaign:', error);
      toast.error(error.message || 'Failed to save campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Campaign' : 'Create Campaign'}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
            >
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={() => navigate('/admin/campaigns')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>

        {previewMode ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">{formData.title || 'Campaign Title'}</h2>
            <p className="text-gray-600 mb-6">{formData.description || 'Description'}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Goal:</span> ${formData.target_amount || '0'}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter campaign title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description (will appear in campaign cards)"
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Story <span className="text-red-500">*</span>
              </label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed campaign story..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Target Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="target_amount"
                  value={formData.target_amount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Campaign location (optional)"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-500">Max 10 photos, 5MB each. First photo will be the cover image.</p>
              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.photos.map((photo, idx) => {
                    // Handle both URL strings and file objects with preview
                    const photoUrl = typeof photo === 'string' ? photo : (photo.preview || URL.createObjectURL(photo.file));
                    return (
                      <div key={idx} className="relative">
                        <img src={photoUrl} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              photos: formData.photos.filter((_, i) => i !== idx),
                            });
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Feature this campaign on homepage
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/campaigns')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default CreateEditCampaign;

