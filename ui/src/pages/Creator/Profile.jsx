import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const Profile = () => {
  const { userProfile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    niches: [],
    socialMedia: {
      instagram: '',
      tiktok: '',
      youtube: '',
      twitter: '',
    },
    demographics: {
      ageRange: '',
      gender: '',
      interests: [],
      location: '',
    },
    metrics: {
      averageEngagement: '',
      totalFollowers: '',
    },
  });
  
  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    link: '',
    imageUrl: '',
  });
  
  // Populate form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        niches: userProfile.niches || [],
        socialMedia: userProfile.socialMedia || {
          instagram: '',
          tiktok: '',
          youtube: '',
          twitter: '',
        },
        demographics: userProfile.demographics || {
          ageRange: '',
          gender: '',
          interests: [],
          location: '',
        },
        metrics: userProfile.metrics || {
          averageEngagement: '',
          totalFollowers: '',
        },
      });
      
      setPortfolioItems(userProfile.portfolioItems || []);
    }
  }, [userProfile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects in form data
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleNicheChange = (e) => {
    const value = e.target.value;
    
    if (e.target.checked) {
      setFormData({
        ...formData,
        niches: [...formData.niches, value]
      });
    } else {
      setFormData({
        ...formData,
        niches: formData.niches.filter(niche => niche !== value)
      });
    }
  };
  
  const handleInterestChange = (e) => {
    const value = e.target.value;
    
    if (e.target.checked) {
      setFormData({
        ...formData,
        demographics: {
          ...formData.demographics,
          interests: [...formData.demographics.interests, value]
        }
      });
    } else {
      setFormData({
        ...formData,
        demographics: {
          ...formData.demographics,
          interests: formData.demographics.interests.filter(interest => interest !== value)
        }
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile({
        ...formData,
        portfolioItems
      });
      
      setSuccess('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolioItem({
      ...newPortfolioItem,
      [name]: value
    });
  };
  
  const addPortfolioItem = () => {
    if (!newPortfolioItem.title || !newPortfolioItem.link) {
      setError('Portfolio item title and link are required');
      return;
    }
    
    setPortfolioItems([...portfolioItems, { ...newPortfolioItem, id: Date.now() }]);
    setNewPortfolioItem({
      title: '',
      description: '',
      link: '',
      imageUrl: '',
    });
    setIsModalOpen(false);
  };
  
  const removePortfolioItem = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };
  
  // Available niches and interests for checkboxes
  const availableNiches = [
    'Fashion', 'Beauty', 'Fitness', 'Health', 'Food', 'Travel', 'Lifestyle',
    'Technology', 'Gaming', 'Entertainment', 'Education', 'Finance', 'Business',
    'Sports', 'Art', 'Music', 'DIY', 'Parenting', 'Pets', 'Photography'
  ];
  
  const availableInterests = [
    'Shopping', 'Outdoor Activities', 'Reading', 'Cooking', 'Home Decor',
    'Investment', 'Movies', 'Television', 'Concerts', 'Sports Events', 'Theater',
    'Tech Gadgets', 'Cars', 'Fashion Trends', 'Beauty Products', 'Health & Wellness',
    'Sustainable Living', 'Luxury Goods', 'Budget Shopping', 'Family Activities'
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Creator Profile
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your personal information, social media accounts, and portfolio.
                </p>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`${activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Social Media
                </button>
                <button
                  onClick={() => setActiveTab('audience')}
                  className={`${activeTab === 'audience'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Audience & Metrics
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`${activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Portfolio
                </button>
              </nav>
            </div>
            
            {/* Success/Error Messages */}
            {success && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                {/* Personal Information Tab */}
                {activeTab === 'profile' && (
                  <Card className="overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                            Display Name
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            id="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="City, Country"
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows="3"
                            value={formData.bio}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Tell brands about yourself..."
                          ></textarea>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <fieldset>
                            <legend className="text-sm font-medium text-gray-700">Content Niches</legend>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2">
                              {availableNiches.map((niche) => (
                                <div key={niche} className="flex items-center">
                                  <input
                                    id={`niche-${niche}`}
                                    name={`niche-${niche}`}
                                    type="checkbox"
                                    value={niche}
                                    checked={formData.niches.includes(niche)}
                                    onChange={handleNicheChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`niche-${niche}`} className="ml-2 block text-sm text-gray-700">
                                    {niche}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* Social Media Tab */}
                {activeTab === 'social' && (
                  <Card className="overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700">
                            Instagram Username
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">@</span>
                            </div>
                            <input
                              type="text"
                              name="socialMedia.instagram"
                              id="socialMedia.instagram"
                              value={formData.socialMedia.instagram}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="socialMedia.tiktok" className="block text-sm font-medium text-gray-700">
                            TikTok Username
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">@</span>
                            </div>
                            <input
                              type="text"
                              name="socialMedia.tiktok"
                              id="socialMedia.tiktok"
                              value={formData.socialMedia.tiktok}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="socialMedia.youtube" className="block text-sm font-medium text-gray-700">
                            YouTube Channel Name
                          </label>
                          <input
                            type="text"
                            name="socialMedia.youtube"
                            id="socialMedia.youtube"
                            value={formData.socialMedia.youtube}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-gray-700">
                            Twitter Username
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">@</span>
                            </div>
                            <input
                              type="text"
                              name="socialMedia.twitter"
                              id="socialMedia.twitter"
                              value={formData.socialMedia.twitter}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* Audience & Metrics Tab */}
                {activeTab === 'audience' && (
                  <Card className="overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="metrics.totalFollowers" className="block text-sm font-medium text-gray-700">
                            Total Followers (across all platforms)
                          </label>
                          <input
                            type="number"
                            name="metrics.totalFollowers"
                            id="metrics.totalFollowers"
                            value={formData.metrics.totalFollowers}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="metrics.averageEngagement" className="block text-sm font-medium text-gray-700">
                            Average Engagement Rate (%)
                          </label>
                          <input
                            type="number"
                            name="metrics.averageEngagement"
                            id="metrics.averageEngagement"
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.metrics.averageEngagement}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="demographics.ageRange" className="block text-sm font-medium text-gray-700">
                            Primary Audience Age Range
                          </label>
                          <select
                            id="demographics.ageRange"
                            name="demographics.ageRange"
                            value={formData.demographics.ageRange}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select age range</option>
                            <option value="13-17">13-17</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55+">55+</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="demographics.gender" className="block text-sm font-medium text-gray-700">
                            Primary Audience Gender
                          </label>
                          <select
                            id="demographics.gender"
                            name="demographics.gender"
                            value={formData.demographics.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select gender</option>
                            <option value="mostly-female">Mostly Female</option>
                            <option value="mostly-male">Mostly Male</option>
                            <option value="balanced">Balanced</option>
                          </select>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="demographics.location" className="block text-sm font-medium text-gray-700">
                            Primary Audience Location
                          </label>
                          <input
                            type="text"
                            name="demographics.location"
                            id="demographics.location"
                            value={formData.demographics.location}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Country or Region"
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <fieldset>
                            <legend className="text-sm font-medium text-gray-700">Audience Interests</legend>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2">
                              {availableInterests.map((interest) => (
                                <div key={interest} className="flex items-center">
                                  <input
                                    id={`interest-${interest}`}
                                    name={`interest-${interest}`}
                                    type="checkbox"
                                    value={interest}
                                    checked={formData.demographics.interests.includes(interest)}
                                    onChange={handleInterestChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-700">
                                    {interest}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Portfolio Items</h3>
                      <Button onClick={() => setIsModalOpen(true)}>
                        Add Portfolio Item
                      </Button>
                    </div>
                    
                    {portfolioItems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolioItems.map((item) => (
                          <Card key={item.id} className="overflow-hidden" hover={true}>
                            {item.imageUrl && (
                              <div className="h-48 w-full overflow-hidden">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="px-4 py-5 sm:p-6">
                              <h4 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                              )}
                              <div className="flex justify-between items-center">
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                  View Content
                                </a>
                                <button
                                  type="button"
                                  onClick={() => removePortfolioItem(item.id)}
                                  className="text-sm text-red-600 hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <div className="px-4 py-8 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">You haven't added any portfolio items yet.</p>
                          <p className="mt-1 text-sm text-gray-500">Showcase your best content to attract brand opportunities.</p>
                          <div className="mt-6">
                            <Button onClick={() => setIsModalOpen(true)}>
                              Add Your First Item
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
                
                {/* Save Button (for all tabs except portfolio) */}
                {activeTab !== 'portfolio' && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </form>
            
            {/* Add Portfolio Item Modal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Add Portfolio Item"
              size="lg"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={newPortfolioItem.title}
                    onChange={handlePortfolioChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Campaign name or content title"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="2"
                    value={newPortfolioItem.description}
                    onChange={handlePortfolioChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Brief description of this content"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700">Content Link</label>
                  <input
                    type="url"
                    name="link"
                    id="link"
                    value={newPortfolioItem.link}
                    onChange={handlePortfolioChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    value={newPortfolioItem.imageUrl}
                    onChange={handlePortfolioChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://..."
                  />
                </div>
                
                <div className="mt-5 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={addPortfolioItem}
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;