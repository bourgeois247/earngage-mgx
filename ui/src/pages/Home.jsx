import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { getFixedImagePath } from '../utils/generatePlaceholders';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Connect Nano & Micro Creators with Brand Campaigns
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                EarnGage helps authentic creators monetize their influence and enables brands to reach engaged audiences through genuine partnerships.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Get Started — It's Free
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10" size="lg">
                  How It Works
                </Button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <img 
                src={getFixedImagePath("/assets/images/hero-image.png")} 
                alt="EarnGage Platform" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose EarnGage?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our platform offers unique benefits for both creators and brands
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect with the Right Partners</h3>
                <p className="text-gray-600">
                  Our matching algorithm connects brands with creators who align with their values and audience demographics.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Streamlined Campaign Management</h3>
                <p className="text-gray-600">
                  From application to payment, manage the entire campaign process in one place with our intuitive dashboard.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Measurable Results</h3>
                <p className="text-gray-600">
                  Track campaign performance with detailed analytics to measure ROI and optimize future collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Creators Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-8">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                For Creators
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Monetize your influence and build your portfolio with brand partnerships that align with your values.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Discover campaigns that match your niche and audience</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Receive fair compensation for your content</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Showcase your performance metrics to attract more opportunities</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Build a professional portfolio of brand collaborations</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register?type=creator">
                  <Button variant="primary" size="lg">
                    Join as a Creator
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <img 
                src={getFixedImagePath("/assets/images/creator-dashboard.png")} 
                alt="Creator Dashboard" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* For Brands Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:order-2 md:w-1/2 md:pl-8">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                For Brands
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Connect with authentic creators who can genuinely represent your brand to engaged audiences.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Find creators with audiences that match your target demographics</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Create campaigns within your budget — no matter the size</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Review detailed analytics on campaign performance</span>
                </li>
                <li className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Manage the entire campaign process in one platform</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register?type=brand">
                  <Button variant="primary" size="lg">
                    Join as a Brand
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:order-1 md:w-1/2">
              <img 
                src={getFixedImagePath("/assets/images/brand-dashboard.png")} 
                alt="Brand Dashboard" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How EarnGage Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              A simple process to connect creators and brands
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Step 1 */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 z-10">1</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Create Profile</h3>
                  <p className="text-gray-600 text-center">Sign up and build your creator or brand profile</p>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 z-10">2</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Connect</h3>
                  <p className="text-gray-600 text-center">Brands create campaigns, creators discover and apply</p>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 z-10">3</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Collaborate</h3>
                  <p className="text-gray-600 text-center">Work together on content creation and approval</p>
                </div>

                {/* Step 4 */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 z-10">4</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Compensate</h3>
                  <p className="text-gray-600 text-center">Secure payments and performance tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Join EarnGage today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Sign up for free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;