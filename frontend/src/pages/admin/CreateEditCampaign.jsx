import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const CreateEditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    target_amount: '',
    category: '',
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
    if (isEditMode) {
      // TODO: Replace with actual API call: GET /api/campaigns/:id
      setTimeout(() => {
        setFormData({
          title: 'Help Build a School in Rural Area',
          description: 'Support education for underprivileged children',
          long_description: 'Full description here...',
          target_amount: '50000',
          category: 'Education',
          start_date: '2024-01-15',
          end_date: '2024-12-31',
          location: 'Rural Village, District XYZ',
          photos: [],
          featured: true,
        });
      }, 500);
    }
  }, [id, isEditMode]);

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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // TODO: Replace with actual file upload API: POST /api/campaigns/:id/photos
    toast.success(`${files.length} photo(s) selected`);
    setFormData({
      ...formData,
      photos: [...formData.photos, ...files.map((f) => URL.createObjectURL(f))],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // if (isEditMode) {
      //   await api.campaigns.update(id, formData);
      // } else {
      //   await api.campaigns.create(formData);
      // }
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Campaign ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate('/admin/campaigns');
    } catch (error) {
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
              <div>
                <span className="text-gray-500">Category:</span> {formData.category || 'N/A'}
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

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Food & Shelter">Food & Shelter</option>
                </select>
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
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img src={photo} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
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
                  ))}
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

