# Project Summary
EarnGage is a platform designed for content creators in the African market, particularly focusing on Nigeria and its diaspora. It empowers creators to manage their profiles, discover brand campaigns, and integrate their social media accounts, enhancing their online presence through effective brand management features. Brands can efficiently create and manage campaigns, facilitating productive interactions with creators. The integration of Rows.com has strengthened EarnGage's data handling capabilities.

# Project Module Description
- **Authentication Module**: Manages user login and registration for creators and brands.
- **Dashboard Module**: Central interface for creators to manage profiles and view metrics.
- **Campaign Discovery Module**: Allows creators to search and filter brand campaigns.
- **Brand Management Module**: Assists brands in creating and managing their campaigns.
- **API Service Layer**: Integrates with Rows.com for authentication and CRUD operations on data entities.

# Directory Tree
```
.
├── earngage_class_diagram.mermaid          
├── earngage_product_requirements_document.md 
├── earngage_sequence_diagram.mermaid       
├── earngage_system_design.md                
├── react_template/
│   ├── README.md                            
│   ├── eslint.config.js                     
│   ├── index.html                           
│   ├── package.json                         
│   ├── postcss.config.js                    
│   ├── public/data/example.json             
│   ├── public/assets/images/brands/         # Directory for brand logos
│   ├── public/assets/images/campaigns/      # Directory for campaign images
│   ├── src/
│   │   ├── App.jsx                          
│   │   ├── components/Layout/
│   │   │   ├── Footer.jsx                   
│   │   │   ├── Navbar.jsx                   
│   │   │   ├── Sidebar.jsx                  
│   │   ├── components/ui/
│   │   │   ├── Button.jsx                   
│   │   │   ├── Card.jsx                     
│   │   │   ├── Modal.jsx                    
│   │   ├── context/
│   │   │   ├── AuthContext.jsx              
│   │   ├── index.css                        
│   │   ├── main.jsx                         
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx                
│   │   │   │   ├── Register.jsx             
│   │   │   ├── Creator/
│   │   │   │   ├── CampaignDiscovery.jsx    
│   │   │   │   ├── Dashboard.jsx            
│   │   │   │   ├── Profile.jsx              
│   │   │   ├── Brand/
│   │   │   │   ├── Dashboard.jsx            
│   │   │   │   ├── Profile.jsx              
│   │   │   │   ├── CampaignCreation.jsx     
│   │   │   ├── Home.jsx                     
│   │   ├── services/
│   │   │   ├── api.js                       
│   │   │   ├── auth.js                      
│   │   │   ├── campaigns.js                 
│   │   │   ├── applications.js              
│   │   │   ├── analytics.js                 
│   │   │   ├── rowsApi.js                   
│   │   │   ├── users.js                     
│   │   ├── utils/
│   │   │   ├── apiHelpers.js                
│   │   │   ├── generatePlaceholders.js      
│   ├── tailwind.config.js                   
│   ├── template_config.json                 
│   ├── vite.config.js                       
```

# File Description Inventory
- **API Service**: `src/services/api.js` - Centralizes access to all API services.
- **Authentication Service**: `src/services/auth.js` - Manages user authentication and JWT handling.
- **User Service**: `src/services/users.js` - Handles user profile management for creators and brands.
- **Campaign Service**: `src/services/campaigns.js` - Manages campaign lifecycle including CRUD operations.
- **Application Service**: `src/services/applications.js` - Handles application processes between creators and campaigns.
- **Analytics Service**: `src/services/analytics.js` - Implements event tracking and statistics generation.
- **Rows API Client**: `src/services/rowsApi.js` - Core service for interacting with Rows.com API.
- **API Helpers Utility**: `src/utils/apiHelpers.js` - Provides functions for formatting requests/responses and error handling.
- **Home Page**: `src/pages/Home.jsx` - Main landing page for the application.
- **Creator Dashboard**: `src/pages/Creator/Dashboard.jsx` - Overview interface for creators.
- **Campaign Discovery**: `src/pages/Creator/CampaignDiscovery.jsx` - Browsing and filtering campaigns for creators.

# Technology Stack
- **Frontend**: React.js, Vite, Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router
- **Package Management**: pnpm

# Usage
1. **Install Dependencies**: 
   - Navigate to the project directory and run:
     ```
     pnpm install react-router-dom axios
     ```
2. **Build the Project**: 
   - Use the build command:
     ```
     pnpm run build
     ```
3. **Run the Development Server**: 
   - Start the server with:
     ```
     pnpm run dev
     ```
4. **Lint Check**: 
   - Ensure code quality:
     ```
     pnpm run lint
     ```
