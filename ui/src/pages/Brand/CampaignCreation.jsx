import React from 'react';

const CampaignCreation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="pb-5 border-b border-gray-200 mb-6">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9">
            Create Campaign
          </h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Set up a new creator collaboration campaign
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Details</h2>
          <p className="text-gray-500">This is a placeholder for the Campaign Creation page. The actual page will contain a multi-step form to create new brand campaigns with details like campaign title, description, requirements, compensation, deadlines, etc.</p>
          
          <div className="mt-6 flex items-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Publish Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreation;