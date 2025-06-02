# EarnGage Platform System Design

## Implementation Approach

For implementing the EarnGage platform with Rows.com as the database backend, we'll adopt a pragmatic approach that balances rapid development with future scalability needs:

1. **Frontend Architecture**: React with functional components and hooks for state management, with Tailwind CSS for styling.

2. **Data Storage**: Rows.com spreadsheets as database tables, with clear table structures mimicking relational database design.

3. **State Management**: React Context API for global state, with React Query for server state management and caching.

4. **Authentication**: JWT-based token authentication stored in localStorage with appropriate security measures.

5. **API Layer**: A dedicated service layer that abstracts all interactions with the Rows.com API.

### Key Technical Decisions

- **Database**: Rows.com spreadsheets organized into normalized tables
- **API Communication**: Axios for HTTP requests to Rows.com API
- **Data Serialization**: JSON strings for complex data types in Rows.com cells
- **UI Framework**: React with Tailwind CSS for responsive design
- **Forms Management**: Formik with Yup for form validation
- **Charts and Visualization**: Chart.js for analytics dashboards

### Open Source Libraries

- **axios** (^1.4.0): For handling HTTP requests
- **react-query** (^4.29.5): For data fetching, caching, and state management
- **react-router-dom** (^6.11.1): For client-side routing
- **formik** (^2.2.9) + **yup** (^1.1.1): For form handling and validation
- **chart.js** (^4.3.0) + **react-chartjs-2** (^5.2.0): For analytics visualizations
- **date-fns** (^2.30.0): For date manipulation and formatting
- **uuid** (^9.0.0): For generating unique identifiers

## Data Structures and Interfaces

The EarnGage platform will use the following data structures implemented as tables in Rows.com:

### Class Diagram Overview

Our system contains multiple interconnected entities that work together to provide the full functionality of the EarnGage platform.

## Data structures and interfaces

Based on the requirements, we need to define classes for user authentication, creator profiles, brand management, campaign discovery, and analytics. Below is a detailed class diagram that represents the core data structures and their relationships.

The system will integrate with Rows.com as the database, using a service layer to handle all data operations through the Rows.com API. Each table in our schema will correspond to a sheet in Rows.com, with relationships maintained through ID references.

### User Authentication & Management

```typescript
class User {
  user_id: string;  // UUID format
  email: string;  // Unique
  password_hash: string;  // Bcrypt hashed
  user_type: string;  // "creator" or "brand"
  name: string;
  profile_image: string;  // URL
  date_joined: Date;
  status: string;  // "active", "inactive", "suspended"
  phone_number: string;
  country: string;
  verified: boolean;
  last_login: Date;
}
```

### Creator Module

```typescript
class CreatorProfile {
  creator_id: string;  // References User.user_id
  bio: string;
  location: string;
  niche: string;
  portfolio_links: string[];  // JSON array in Rows.com
  // Social media handles
  instagram_handle: string;
  twitter_handle: string;
  tiktok_handle: string;
  youtube_channel: string;
  facebook_page: string;
  // Metrics
  followers_count: Record<string, number>;  // JSON object in Rows.com
  engagement_rate: Record<string, number>;  // JSON object in Rows.com
  // Banking & categories
  bank_details: object;  // JSON object in Rows.com (encrypted)
  content_categories: string[];  // JSON array in Rows.com
  showcase_items: object[];  // JSON array in Rows.com
}
```

### Brand Module

```typescript
class BrandProfile {
  brand_id: string;  // References User.user_id
  company_name: string;
  industry: string;
  description: string;
  website: string;
  logo_url: string;
  contact_email: string;
  contact_person: string;
  company_size: string;  // "small", "medium", "large"
  years_in_business: number;
  target_audience: object;  // JSON object in Rows.com
  brand_colors: string[];  // JSON array in Rows.com
  payment_verified: boolean;
  social_media_links: Record<string, string>;  // JSON object in Rows.com
}
```

### Campaign Module

```typescript
class Campaign {
  campaign_id: string;  // UUID format
  brand_id: string;  // References BrandProfile.brand_id
  title: string;
  description: string;
  requirements: string;
  budget_range: {
    min: number;
    max: number;
    currency: string;
  };  // JSON object in Rows.com
  start_date: Date;
  end_date: Date;
  status: string;  // "draft", "active", "paused", "completed"
  niche_category: string[];  // JSON array in Rows.com
  platform_requirements: Record<string, boolean>;  // JSON object in Rows.com
  deliverables: object[];  // JSON array in Rows.com
  application_deadline: Date;
  min_followers: number;
  target_regions: string[];  // JSON array in Rows.com
  creation_date: Date;
  visibility: string;  // "public", "invite-only"
}
```

### Application Module

```typescript
class Application {
  application_id: string;  // UUID format
  campaign_id: string;  // References Campaign.campaign_id
  creator_id: string;  // References CreatorProfile.creator_id
  status: string;  // "pending", "approved", "rejected", "completed"
  proposal: string;
  date_applied: Date;
  compensation_amount: number;
  platform_selection: string[];  // JSON array in Rows.com
  proposed_content: string;
  expected_metrics: object;  // JSON object in Rows.com
  rejection_reason?: string;
  approval_date?: Date;
  completion_date?: Date;
  payment_status: string;  // "pending", "paid", "disputed"
}
```

### Analytics Module

```typescript
class Analytics {
  record_id: string;  // UUID format
  creator_id?: string;  // References CreatorProfile.creator_id
  campaign_id?: string;  // References Campaign.campaign_id
  date: Date;
  platform: string;  // "instagram", "twitter", etc.
  content_url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks?: number;
  conversions?: number;
  earnings?: number;
  reach: number;
  engagement_rate: number;  // Percentage as decimal
  impressions: number;
}
```

### Notification Module

```typescript
class Notification {
  notification_id: string;  // UUID format
  user_id: string;  // References User.user_id
  message: string;
  type: string;  // "application", "payment", etc.
  is_read: boolean;
  created_at: Date;
  related_id?: string;  // Optional reference to related entity
}
```

## API Services

### Rows.com API Service

```typescript
class RowsApiService {
  constructor(apiKey: string, workspaceId: string);
  
  // Generic CRUD operations
  async getRows(tableName: string, filters?: object): Promise<any[]>;
  async getRowById(tableName: string, idField: string, id: string): Promise<any>;
  async createRow(tableName: string, data: object): Promise<any>;
  async updateRow(tableName: string, idField: string, id: string, data: object): Promise<any>;
  async deleteRow(tableName: string, idField: string, id: string): Promise<boolean>;
  
  // Helper methods
  processRecordForRows(record: any): any;  // Prepare record for Rows.com (stringify objects)
  processRecordFromRows(record: any): any;  // Process record from Rows.com (parse JSON)
}
```

### Authentication Service

```typescript
class AuthService {
  constructor(rowsApiService: RowsApiService);
  
  async register(userData: UserRegistrationData): Promise<AuthResult>;
  async login(email: string, password: string): Promise<AuthResult>;
  async logout(): Promise<void>;
  async getCurrentUser(): Promise<User | null>;
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User>;
  isAuthenticated(): boolean;
  getAuthToken(): string | null;
}
```

### Creator Service

```typescript
class CreatorService {
  constructor(rowsApiService: RowsApiService);
  
  async getCreatorProfile(creatorId: string): Promise<CreatorProfile>;
  async updateCreatorProfile(creatorId: string, data: Partial<CreatorProfile>): Promise<CreatorProfile>;
  async getAnalytics(creatorId: string, dateRange?: DateRange): Promise<Analytics[]>;
  async getApplications(creatorId: string, status?: string): Promise<Application[]>;
  async applyCampaign(campaignId: string, creatorId: string, applicationData: ApplicationData): Promise<Application>;
}
```

### Brand Service

```typescript
class BrandService {
  constructor(rowsApiService: RowsApiService);
  
  async getBrandProfile(brandId: string): Promise<BrandProfile>;
  async updateBrandProfile(brandId: string, data: Partial<BrandProfile>): Promise<BrandProfile>;
  async createCampaign(campaignData: CampaignData): Promise<Campaign>;
  async updateCampaign(campaignId: string, data: Partial<Campaign>): Promise<Campaign>;
  async getCampaignApplications(campaignId: string, status?: string): Promise<Application[]>;
  async reviewApplication(applicationId: string, status: string, feedback?: string): Promise<Application>;
}
```

### Campaign Service

```typescript
class CampaignService {
  constructor(rowsApiService: RowsApiService);
  
  async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]>;
  async getCampaignById(campaignId: string): Promise<Campaign>;
  async getRecommendedCampaigns(creatorId: string): Promise<Campaign[]>;
}
```

### Notification Service

```typescript
class NotificationService {
  constructor(rowsApiService: RowsApiService);
  
  async getUserNotifications(userId: string): Promise<Notification[]>;
  async markAsRead(notificationId: string): Promise<boolean>;
  async createNotification(notification: Omit<Notification, 'notification_id' | 'created_at'>): Promise<Notification>;
}
```

## Program Call Flow

Below is a detailed sequence of interactions between the various components of the EarnGage platform:

### Authentication Flow

1. User enters login credentials (email/password) on login form
2. UI component calls AuthService.login(email, password)
3. AuthService contacts RowsApiService to query the Users table
4. RowsApiService makes HTTP request to Rows.com API
5. AuthService validates credentials and generates JWT token
6. Token is stored in browser localStorage
7. User state is updated in Context API
8. User is redirected to appropriate dashboard based on user_type

### Creator Dashboard Flow

1. Dashboard component initializes and checks authentication
2. Component dispatches multiple data fetching operations:
   - CreatorService.getCreatorProfile(creatorId)
   - CreatorService.getAnalytics(creatorId)
   - CreatorService.getApplications(creatorId)
   - NotificationService.getUserNotifications(userId)
3. React Query handles caching and synchronizes UI with data
4. Analytics data is processed and passed to Chart.js components
5. Creator can navigate to different dashboard sections

### Campaign Discovery Flow

1. Creator navigates to Campaign Discovery page
2. Component calls CampaignService.getCampaigns() with default filters
3. Results are displayed in a filterable, paginated list
4. Creator applies filters (niche, budget, platform)
5. Component calls CampaignService.getCampaigns(filters) with updated criteria
6. Updated results are displayed
7. Creator clicks on campaign to view details
8. Component calls CampaignService.getCampaignById(campaignId)
9. Campaign details displayed with option to apply

### Campaign Application Flow

1. Creator views campaign details and clicks "Apply"
2. Application form component initializes with creator profile data
3. Creator completes form and submits
4. Component calls CreatorService.applyCampaign() with form data
5. RowsApiService creates new record in Applications table
6. NotificationService creates notification for brand
7. Success confirmation shown to creator

### Brand Campaign Management Flow

1. Brand creates new campaign through form
2. Component validates form and calls BrandService.createCampaign()
3. RowsApiService adds record to Campaigns table
4. Brand views list of existing campaigns
5. Brand clicks campaign to view details and applications
6. Component calls BrandService.getCampaignApplications()
7. Brand reviews applications and approves/rejects
8. Component calls BrandService.reviewApplication()
9. NotificationService creates notification for creator

### Analytics Tracking Flow

1. Creator connects social media accounts
2. System schedules periodic data collection from social APIs
3. Analytics data is normalized and stored in Analytics table
4. When creator views analytics dashboard:
   - Component requests analytics with date filters
   - Data is processed and formatted for visualization
   - Chart.js components render performance metrics

## Anything UNCLEAR

1. **Payment Processing**: The current design accommodates tracking payment status, but actual payment processing will likely require integration with third-party payment gateways. Once we move beyond Rows.com to a production database, we'll need to define the specific payment gateway and integration approach.

2. **Social Media API Integration**: While we've designed structures for storing social media analytics, the specifics of pulling data from each platform's API will need to be defined. Different platforms have varying rate limits, authentication mechanisms, and data formats.

3. **Data Migration Strategy**: As the platform grows, we'll need to plan for migration from Rows.com to a more scalable database solution like MongoDB. We should define triggers for this migration (e.g., user count, data volume) and a detailed migration plan to ensure data integrity.

4. **Notification Delivery**: The current design tracks notifications in the database but doesn't specify the delivery mechanism (in-app only vs. email/push notifications). This should be clarified for the next phase of development.

5. **Security Considerations**: While we're using password hashing and JWT for authentication, additional security measures like rate limiting, input validation, and protection against common web vulnerabilities should be implemented before production launch.