import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getFixedImagePath } from '../../utils/generatePlaceholders';
import api from '../../services/api';

const Dashboard = () => {
  const { userProfile, currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState({
    active: [],
    recommended: [],
    pending: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch creator dashboard data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        if (!currentUser?.id) {
          console.error('No user ID found');
          setIsLoading(false);
          return;
        }
        
        // Get real data from Rows.com API services
        const [applicationsResponse, recommendedResponse, statsResponse] = await Promise.all([
          // Get approved applications (active campaigns)
          api.applications.getByCreatorId(currentUser.id),
          // Get recommended campaigns
          api.campaigns.getRecommendedCampaigns(currentUser.id),
          // Get creator stats
          api.analytics.getCreatorStats(currentUser.id)
        ]);
        
        // Update stats with real data if available
        if (statsResponse) {
          const updatedStats = [...stats];
          
          // Total Earnings
          if (statsResponse.totalEarnings !== undefined) {
            updatedStats[0].value = `$${statsResponse.totalEarnings.toFixed(2)}`;
          }
          
          // Active Campaigns
          if (statsResponse.activeCampaigns !== undefined) {
            updatedStats[1].value = statsResponse.activeCampaigns.toString();
          } else {
            // Fallback to counting active campaigns from applications
            const activeCount = applicationsResponse.filter(app => 
              app.status === 'approved' || app.status === 'in_progress'
            ).length;
            updatedStats[1].value = activeCount.toString();
          }
          
          // Completion Rate
          if (statsResponse.completionRate !== undefined) {
            updatedStats[2].value = `${Math.round(statsResponse.completionRate)}%`;
          } else if (statsResponse.completedCampaigns !== undefined && statsResponse.totalCampaigns > 0) {
            const rate = (statsResponse.completedCampaigns / statsResponse.totalCampaigns) * 100;
            updatedStats[2].value = `${Math.round(rate)}%`;
          }
          
          // Response Time
          if (statsResponse.averageResponseTime !== undefined) {
            updatedStats[3].value = `${statsResponse.averageResponseTime.toFixed(1)} days`;
          }
          
          setStats(updatedStats);
        }
        
        // Format active campaigns data
        const activeCampaigns = [];
        const pendingApplications = [];
        
        // Process applications to separate active and pending
        for (const app of applicationsResponse) {
          if (!app.campaign) continue;
          
          const brandName = app.campaign.brand?.companyName || 'Unknown Brand';
          const brandLogo = app.campaign.brand?.logoUrl || '/assets/images/brand-logo-1.png';
          
          const campaignData = {
            id: app.campaignId,
            title: app.campaign.title,
            brandName: brandName,
            brandLogo: brandLogo,
            compensation: `$${app.campaign.budget || 0}`,
            dueDate: app.campaign.endDate ? new Date(app.campaign.endDate).toISOString().split('T')[0] : 'N/A',
            status: app.status === 'approved' ? 'In Progress' : 
                   app.status === 'completed' ? 'Completed' : app.status
          };
          
          if (app.status === 'approved' || app.status === 'completed') {
            activeCampaigns.push(campaignData);
          } else if (app.status === 'pending') {
            pendingApplications.push({
              ...campaignData,
              appliedDate: new Date(app.createdAt).toISOString().split('T')[0],
              status: 'Under Review'
            });
          }
        }
        
        // Format recommended campaigns
        const recommendedCampaigns = recommendedResponse.map(campaign => {
          // Try to find brand data
          const brandName = campaign.brandName || 'Brand Partner';
          const brandLogo = campaign.brandLogo || '/assets/images/brand-logo-3.png';
          
          // Calculate match score (this would be calculated by the recommendation algorithm)
          const matchScore = Math.floor(Math.random() * 20) + 80; // Random score between 80-100 for demo
          
          return {
            id: campaign.id,
            title: campaign.title,
            brandName: brandName,
            brandLogo: brandLogo,
            compensation: campaign.budget ? `$${campaign.budget}` : '$200-400',
            deadline: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : 'Open',
            matchScore: matchScore
          };
        });
        
        setCampaigns({
          active: activeCampaigns,
          recommended: recommendedCampaigns,
          pending: pendingApplications
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fall back to empty arrays if API call fails
        setCampaigns({
          active: [],
          recommended: [],
          pending: []
        });
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser, stats]);

  // State for stats cards
  const [stats, setStats] = useState([
    { name: 'Total Earnings', value: '$0', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Active Campaigns', value: '0', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Completion Rate', value: '0%', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { name: 'Avg. Response Time', value: 'N/A', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile?.displayName || 'Creator'}!
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Here's what's happening with your creator account today.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link to="/creator/discover">
                  <Button>
                    <svg className="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Discover Campaigns
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.name} className="px-4 py-5 sm:p-6" hover={true}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Active Campaigns */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Active Campaigns</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {isLoading ? (
                  <div className="col-span-2 flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : campaigns.active.length > 0 ? (
                  campaigns.active.map((campaign) => (
                    <Card 
                      key={campaign.id}
                      className="overflow-hidden"
                      hover={true}
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                              src={getFixedImagePath(campaign.brandLogo)} 
                              alt={campaign.brandName} 
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-500">{campaign.brandName}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                              campaign.status === 'Content Submitted' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Compensation</p>
                            <p className="text-sm font-medium text-gray-900">{campaign.compensation}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Due Date</p>
                            <p className="text-sm font-medium text-gray-900">{campaign.dueDate}</p>
                          </div>
                          <div>
                            <Link to={`/creator/campaigns/${campaign.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-2">
                    <div className="px-4 py-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">You don't have any active campaigns yet.</p>
                      <div className="mt-4">
                        <Link to="/creator/discover">
                          <Button>
                            Browse Campaigns
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Pending Applications */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Pending Applications</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {isLoading ? (
                  <div className="col-span-2 flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : campaigns.pending.length > 0 ? (
                  campaigns.pending.map((application) => (
                    <Card 
                      key={application.id}
                      className="overflow-hidden"
                      hover={true}
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                              src={getFixedImagePath(application.brandLogo)} 
                              alt={application.brandName} 
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {application.title}
                            </h3>
                            <p className="text-sm text-gray-500">{application.brandName}</p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {application.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Compensation</p>
                            <p className="text-sm font-medium text-gray-900">{application.compensation}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Applied On</p>
                            <p className="text-sm font-medium text-gray-900">{application.appliedDate}</p>
                          </div>
                          <div>
                            <Link to={`/creator/applications/${application.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-2">
                    <div className="px-4 py-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">You don't have any pending applications.</p>
                      <div className="mt-4">
                        <Link to="/creator/discover">
                          <Button>
                            Apply to Campaigns
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Recommended Campaigns */}
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recommended For You</h2>
                <Link to="/creator/discover" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-3 flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  campaigns.recommended.map((campaign) => (
                    <Card 
                      key={campaign.id}
                      className="overflow-hidden"
                      hover={true}
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                              src={getFixedImagePath(campaign.brandLogo)} 
                              alt={campaign.brandName} 
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 truncate max-w-xs">
                              {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-500">{campaign.brandName}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Match Score</span>
                            <span className="text-sm font-medium text-green-600">{campaign.matchScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${campaign.matchScore}%` }}></div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between text-sm">
                          <div>
                            <p className="text-gray-500">Compensation</p>
                            <p className="font-medium text-gray-900">{campaign.compensation}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Deadline</p>
                            <p className="font-medium text-gray-900">{campaign.deadline}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link to={`/creator/campaigns/${campaign.id}/apply`}>
                            <Button variant="outline" fullWidth>
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;