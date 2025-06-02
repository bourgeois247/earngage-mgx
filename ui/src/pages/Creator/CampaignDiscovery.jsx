import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { getFixedImagePath } from '../../utils/generatePlaceholders';

const CampaignDiscovery = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    compensation: [],
    type: [],
  });

  // Available filter options
  const filterOptions = {
    categories: [
      'Fashion', 'Beauty', 'Fitness', 'Health', 'Food', 'Travel', 'Lifestyle',
      'Technology', 'Gaming', 'Entertainment', 'Education'
    ],
    compensation: ['Paid', 'Product', 'Commission'],
    type: ['Post', 'Story', 'Reel', 'Video', 'Review']
  };

  // Fetch campaigns on component mount
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await api.campaigns.getActive();
        setCampaigns(response || []);
        setFilteredCampaigns(response || []);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaigns();
  }, []);

  // Handle filter changes
  useEffect(() => {
    let results = [...campaigns];
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(campaign => 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        campaign.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filters
    if (filters.categories.length > 0) {
      results = results.filter(campaign => 
        campaign.categories.some(category => filters.categories.includes(category))
      );
    }
    
    // Apply compensation filters
    if (filters.compensation.length > 0) {
      results = results.filter(campaign => 
        filters.compensation.includes(campaign.compensationType)
      );
    }
    
    // Apply type filters
    if (filters.type.length > 0) {
      results = results.filter(campaign => 
        filters.type.includes(campaign.contentType)
      );
    }
    
    setFilteredCampaigns(results);
  }, [searchTerm, filters, campaigns]);

  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      if (updatedFilters[category].includes(value)) {
        // Remove filter if already selected
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Add filter if not already selected
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      categories: [],
      compensation: [],
      type: [],
    });
  };

  // Sample campaign data (mock data for UI development)
  const sampleCampaigns = [
    {
      id: 1,
      title: "Summer Fashion Collection",
      brand: { name: "StyleHaven", logo: "/assets/images/brands/stylehaven.png" },
      description: "Showcase our new summer collection on your Instagram. Looking for authentic styling and creative photography.",
      categories: ["Fashion", "Lifestyle"],
      compensationType: "Paid",
      compensation: "$200 + products",
      contentType: "Post",
      requirements: "1 Instagram post, 1 story mention",
      deadline: "2023-06-30",
      applicationCount: 18,
      imageUrl: "/assets/images/campaigns/summer-fashion.jpg"
    },
    {
      id: 2,
      title: "Eco-Friendly Water Bottle Review",
      brand: { name: "GreenLife", logo: "/assets/images/brands/greenlife.png" },
      description: "Review our new sustainable water bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
      categories: ["Lifestyle", "Health"],
      compensationType: "Product",
      compensation: "Product worth $45",
      contentType: "Review",
      requirements: "Honest review with product usage demonstration",
      deadline: "2023-07-15",
      applicationCount: 12,
      imageUrl: "/assets/images/campaigns/water-bottle.jpg"
    },
    {
      id: 3,
      title: "Fitness Challenge Collaboration",
      brand: { name: "ActivePeak", logo: "/assets/images/brands/activepeak.png" },
      description: "Join our 30-day fitness challenge and document your journey using our app and workout gear.",
      categories: ["Fitness", "Health"],
      compensationType: "Paid",
      compensation: "$300 + workout gear",
      contentType: "Reel",
      requirements: "4 workout posts/reels over 30 days",
      deadline: "2023-07-05",
      applicationCount: 24,
      imageUrl: "/assets/images/campaigns/fitness-challenge.jpg"
    },
    {
      id: 4,
      title: "Vegan Recipe Creation",
      brand: { name: "PlantBasics", logo: "/assets/images/brands/plantbasics.png" },
      description: "Create a unique recipe using our plant-based protein products. Looking for creative, easy-to-follow recipes.",
      categories: ["Food", "Health"],
      compensationType: "Commission",
      compensation: "$50 + 10% commission on sales",
      contentType: "Video",
      requirements: "1 recipe video with clear product placement",
      deadline: "2023-07-20",
      applicationCount: 9,
      imageUrl: "/assets/images/campaigns/vegan-recipe.jpg"
    },
  ];

  // Use sample campaigns if no campaigns are fetched yet
  useEffect(() => {
    if (campaigns.length === 0 && !isLoading) {
      setCampaigns(sampleCampaigns);
      setFilteredCampaigns(sampleCampaigns);
    }
  }, [campaigns, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Discover Campaigns
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Find brand campaigns that match your creator profile
                </p>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="mb-4">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search campaigns by name, brand, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleFilterChange('categories', category)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.categories.includes(category)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        } border`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Compensation Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Compensation</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.compensation.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('compensation', type)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.compensation.includes(type)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        } border`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Content Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Content Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.type.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('type', type)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filters.type.includes(type)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        } border`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Clear Filters Button */}
              {(searchTerm || filters.categories.length > 0 || filters.compensation.length > 0 || filters.type.length > 0) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            
            {/* Campaign Results */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden" hover={true}>
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={getFixedImagePath(campaign.imageUrl || "/assets/images/campaign-placeholder.jpg")}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      {/* Brand info */}
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {campaign.brand.logo ? (
                            <img
                              src={getFixedImagePath(campaign.brand.logo)}
                              alt={campaign.brand.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-500">
                              {campaign.brand.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{campaign.brand.name}</span>
                      </div>
                      
                      {/* Campaign title */}
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{campaign.title}</h3>
                      
                      {/* Campaign description */}
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                      
                      {/* Campaign details */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {campaign.categories.map((category) => (
                          <span
                            key={category}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm">
                          <span className="text-gray-500">Type: </span>
                          <span className="font-medium">{campaign.contentType}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Compensation: </span>
                          <span className="font-medium">{campaign.compensation}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span>Deadline: </span>
                          <span className="font-medium">{new Date(campaign.deadline).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span>{campaign.applicationCount} applicants</span>
                        </div>
                      </div>
                      
                      {/* View Details Button */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button
                          variant="primary"
                          className="w-full"
                          to={`/campaigns/${campaign.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDiscovery;