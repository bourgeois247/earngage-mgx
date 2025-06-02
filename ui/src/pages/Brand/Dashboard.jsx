import React from 'react';

const BrandDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="pb-5 border-b border-gray-200 mb-6">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9">
            Brand Dashboard
          </h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Manage your campaigns, analytics, and creator interactions
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Overview</h2>
          <p className="text-gray-500">This is a placeholder for the Brand Dashboard. The actual dashboard will contain campaign metrics, active campaigns, and application statistics.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Creator Collaborations</h2>
          <p className="text-gray-500">This section will display your active collaborations with creators and pending applications.</p>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;