# EarnGage Platform: Rows.com Implementation Guide

This guide provides detailed instructions for setting up the EarnGage platform's database structure using Rows.com spreadsheets as the backend storage solution.

## Overview

Rows.com will serve as our database during development and testing phase. Each table in our data model will correspond to a sheet in Rows.com, with relationships maintained through ID references between tables.

## Table Creation Process

### General Setup Steps

1. Log into your Rows.com account
2. Create a new workspace for the EarnGage platform
3. For each table defined below:
   - Create a new sheet
   - Name it according to the table name (e.g., "users")
   - Add columns with appropriate data types
   - Set default values where applicable
4. After creating all tables, save your API credentials for application integration

### Data Type Considerations

Rows.com has different data types than traditional databases. Use the following mappings:

- **Text**: For string fields (short and long text)
- **Number**: For numeric fields
- **Date**: For date and timestamp fields
- **Checkbox**: For boolean fields
- **Text (JSON)**: For complex objects/arrays (stored as JSON strings)

## Table Specifications

### 1. Users Table

**Table Name**: `users`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| user_id | Text | Unique identifier | Primary key (e.g., "usr-1a2b3c") |
| email | Text | User's email address | Should be unique |
| password_hash | Text | Hashed password | Store only hashed passwords |
| user_type | Text | User role | Values: "creator" or "brand" |
| name | Text | Full name | |
| profile_image | Text | Image URL | |
| date_joined | Date | Registration date | Use Rows date format |
| status | Text | Account status | Values: "active", "inactive", "suspended" |
| phone_number | Text | Contact number | |
| country | Text | User's country | |
| verified | Checkbox | Email verification | Boolean value |
| last_login | Date | Last login date | Use Rows date format |

### 2. Creator Profiles Table

**Table Name**: `creator_profiles`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| creator_id | Text | References user_id | Foreign key to users table |
| bio | Text | Creator's biography | Can be lengthy text |
| location | Text | Primary location | |
| niche | Text | Content niche | |
| portfolio_links | Text | Work samples | Store as JSON string: `["https://...", "https://..."]` |
| instagram_handle | Text | Instagram username | |
| twitter_handle | Text | Twitter/X username | |
| tiktok_handle | Text | TikTok username | |
| youtube_channel | Text | YouTube channel ID | |
| facebook_page | Text | Facebook page name | |
| followers_count | Text | Platform followers | JSON: `{"instagram": 5000, "twitter": 3000}` |
| engagement_rate | Text | Platform engagement | JSON: `{"instagram": 3.2, "twitter": 2.1}` |
| bank_details | Text | Payment info | Encrypted JSON: `{"bank_name": "...", "account_number": "..."}` |
| content_categories | Text | Creator categories | JSON array: `["fashion", "lifestyle"]` |
| showcase_items | Text | Featured content | JSON array of content items |

### 3. Brand Profiles Table

**Table Name**: `brand_profiles`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| brand_id | Text | References user_id | Foreign key to users table |
| company_name | Text | Official name | |
| industry | Text | Company industry | |
| description | Text | Brand description | Can be lengthy text |
| website | Text | Brand website URL | |
| logo_url | Text | URL to brand logo | |
| contact_email | Text | Business email | |
| contact_person | Text | Primary contact | |
| company_size | Text | Size of company | Values: "small", "medium", "large" |
| years_in_business | Number | Years since founding | |
| target_audience | Text | Demographics | JSON: `{"age": [18, 34], "gender": "all"}` |
| brand_colors | Text | Brand colors | JSON array: `["#FF5733", "#33FF57"]` |
| payment_verified | Checkbox | Payment verification | Boolean value |
| social_media_links | Text | Social profiles | JSON: `{"instagram": "https://..."}` |

### 4. Campaigns Table

**Table Name**: `campaigns`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| campaign_id | Text | Primary identifier | Generate UUID |
| brand_id | Text | References brand_id | Foreign key to brand_profiles |
| title | Text | Campaign title | |
| description | Text | Campaign details | Can be lengthy text |
| requirements | Text | Creator requirements | Can be lengthy text |
| budget_range | Text | Budget information | JSON: `{"min": 50000, "max": 200000, "currency": "NGN"}` |
| start_date | Date | Campaign start | |
| end_date | Date | Campaign end | |
| status | Text | Campaign status | Values: "draft", "active", "paused", "completed" |
| niche_category | Text | Content categories | JSON array: `["fashion", "beauty"]` |
| platform_requirements | Text | Required platforms | JSON: `{"instagram": true, "tiktok": false}` |
| deliverables | Text | Expected outputs | JSON array of deliverable objects |
| application_deadline | Date | Last application date | |
| min_followers | Number | Follower threshold | |
| target_regions | Text | Geographic targets | JSON array: `["Lagos", "Abuja"]` |
| creation_date | Date | Creation timestamp | |
| visibility | Text | Campaign visibility | Values: "public", "invite-only" |

### 5. Applications Table

**Table Name**: `applications`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| application_id | Text | Primary identifier | Generate UUID |
| campaign_id | Text | References campaign_id | Foreign key to campaigns |
| creator_id | Text | References creator_id | Foreign key to creator_profiles |
| status | Text | Application status | Values: "pending", "approved", "rejected", "completed" |
| proposal | Text | Creator's proposal | Can be lengthy text |
| date_applied | Date | Submission date | |
| compensation_amount | Number | Payment amount | |
| platform_selection | Text | Selected platforms | JSON array: `["instagram", "tiktok"]` |
| proposed_content | Text | Content description | Can be lengthy text |
| expected_metrics | Text | Projected metrics | JSON: `{"views": 5000, "engagement": 3}` |
| rejection_reason | Text | If rejected | Optional |
| approval_date | Date | When approved | Optional |
| completion_date | Date | When completed | Optional |
| payment_status | Text | Payment status | Values: "pending", "paid", "disputed" |

### 6. Analytics Table

**Table Name**: `analytics`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| record_id | Text | Primary identifier | Generate UUID |
| creator_id | Text | References creator_id | Optional, foreign key |
| campaign_id | Text | References campaign_id | Optional, foreign key |
| date | Date | Analytics date | |
| platform | Text | Social platform | Values: "instagram", "twitter", etc. |
| content_url | Text | URL to content | |
| views | Number | View count | |
| likes | Number | Like count | |
| comments | Number | Comment count | |
| shares | Number | Share count | |
| clicks | Number | Link click count | Optional |
| conversions | Number | Conversion count | Optional |
| earnings | Number | Creator earnings | Optional |
| reach | Number | Content reach | |
| engagement_rate | Number | Engagement % | Decimal value (e.g., 3.2 for 3.2%) |
| impressions | Number | Impression count | |

### 7. Notifications Table

**Table Name**: `notifications`

| Column Name | Data Type | Description | Notes |
|------------|-----------|-------------|---------|
| notification_id | Text | Primary identifier | Generate UUID |
| user_id | Text | Target user | Foreign key to users |
| message | Text | Notification text | |
| type | Text | Notification type | Values: "application", "payment", etc. |
| is_read | Checkbox | Read status | Boolean value |
| created_at | Date | Creation timestamp | |
| related_id | Text | Related object ID | Optional reference to campaign/application |

## Sample Data

Below are examples of initial data that can be used to populate each table for testing:

### Users Table Sample

```
user_id,email,password_hash,user_type,name,profile_image,date_joined,status,phone_number,country,verified,last_login
usr-001,creator1@example.com,$2a$10$XXXX,creator,Adeola Johnson,https://randomuser.me/api/portraits/women/45.jpg,2023-09-15,active,+2347012345678,Nigeria,TRUE,2023-05-29
usr-002,brand1@example.com,$2a$10$YYYY,brand,Global Tech Nigeria,https://picsum.photos/id/1/200,2023-08-10,active,+2348011223344,Nigeria,TRUE,2023-05-30
usr-003,creator2@example.com,$2a$10$ZZZZ,creator,Chukwu Emmanuel,https://randomuser.me/api/portraits/men/32.jpg,2023-10-05,active,+2348022334455,Nigeria,TRUE,2023-05-28
```

### Creator Profiles Table Sample

```
creator_id,bio,location,niche,portfolio_links,instagram_handle,twitter_handle,tiktok_handle,youtube_channel,facebook_page,followers_count,engagement_rate,bank_details,content_categories,showcase_items
usr-001,"Lifestyle and fashion creator focused on affordable Nigerian fashion.",Lagos,Fashion & Lifestyle,["https://example.com/portfolio1"],adeola_styles,adeola_j,adeola_styles,UC123456789,AdeolaJStyles,{"instagram": 25000},"{"instagram": 3.5}","{"bank_name": "First Bank"}","["fashion", "lifestyle"]","[{"title": "Summer Fashion Tips", "url": "https://instagram.com/p/example1"}]"
usr-003,"Tech enthusiast and content creator focused on gadget reviews.",Abuja,Technology,["https://example.com/tech1"],emtech_reviews,emtech_ng,emtech_reviews,UC987654321,EmmanuelTechReviews,"{"instagram": 18000}","{"instagram": 4.2}","{"bank_name": "GT Bank"}","["technology", "gadgets"]","[{"title": "Budget Smartphones 2023", "url": "https://youtube.com/watch?v=example2"}]"
```

## Implementation Notes

1. **JSON Fields**: Since Rows.com may not have native JSON support, store JSON data as text strings. When retrieving, parse the strings back to JavaScript objects.

2. **Relationships**: Since Rows.com doesn't enforce relationships like a relational database, maintain data integrity through your application logic.

3. **IDs**: Generate UUIDs for IDs either through Rows formulas or in your application before inserting records.

4. **Date Types**: Ensure dates are formatted consistently according to Rows.com's date format requirements.

5. **API Access**: After setting up your tables, generate API credentials in your Rows.com workspace settings. These credentials will be used in the React application to authenticate API requests.

## Next Steps

1. Create these tables in Rows.com
2. Export your Rows.com API credentials
3. Configure the React application to connect to your Rows.com tables
4. Implement the API service layer to handle CRUD operations

## API Integration Code

The following is a sample code snippet for integrating with Rows.com API from your React application:

```javascript
import axios from 'axios';

// Configuration - Store these in environment variables
const ROWS_API_KEY = process.env.REACT_APP_ROWS_API_KEY;
const ROWS_WORKSPACE_ID = process.env.REACT_APP_ROWS_WORKSPACE_ID;
const ROWS_BASE_URL = `https://api.rows.com/v1/workspaces/${ROWS_WORKSPACE_ID}`;

// Create axios instance with authentication headers
const rowsApi = axios.create({
  baseURL: ROWS_BASE_URL,
  headers: {
    'Authorization': `Bearer ${ROWS_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Example function to get users
export const getUsers = async () => {
  try {
    const response = await rowsApi.get('/tables/users/rows');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Example function to create a campaign
export const createCampaign = async (campaignData) => {
  // Process any JSON fields before saving
  const processedData = {
    ...campaignData,
    budget_range: JSON.stringify(campaignData.budget_range),
    niche_category: JSON.stringify(campaignData.niche_category),
    platform_requirements: JSON.stringify(campaignData.platform_requirements),
    deliverables: JSON.stringify(campaignData.deliverables),
    target_regions: JSON.stringify(campaignData.target_regions)
  };
  
  try {
    const response = await rowsApi.post('/tables/campaigns/rows', processedData);
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};
```

This implementation guide provides the foundation for building the EarnGage platform using Rows.com as your database backend during the development and testing phases.