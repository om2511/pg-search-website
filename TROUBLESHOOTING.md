# PG Search Website - Troubleshooting Guide

## 🚨 Current Issues and Solutions

### Issue: PGDetails API endpoints returning 500 errors

**Root Causes:**
1. **MongoDB not running** - Database connection failing
2. **Invalid ObjectId format** - Frontend trying to fetch PG with ID "7" (not a valid MongoDB ObjectId)
3. **Missing data** - No sample data in database

### ✅ Solutions Applied

#### 1. Enhanced Backend Error Handling
- Added ObjectId validation in all PG-related endpoints
- Improved error messages and logging
- Added proper HTTP status codes (400 for bad requests, 404 for not found)

#### 2. Fixed Controller Methods
- `getPGById` - Now validates ObjectId format before database query
- `getPGReviews` - Validates PG ID and checks if PG exists
- `getSimilarPGs` - Validates PG ID and handles missing PGs gracefully
- `createReview` - Added input validation and PG existence check

#### 3. Better Database Connection Handling
- Enhanced connection error messages
- Added connection event handlers
- Process exits gracefully on connection failure

### 🚀 Setup Instructions

#### 1. Start MongoDB
```bash
# Install and start MongoDB (if not already running)
# On Ubuntu/WSL:
sudo systemctl start mongod

# On macOS:
brew services start mongodb/brew/mongodb-community

# On Windows:
# Start MongoDB as a service or run mongod.exe
```

#### 2. Seed the Database
```bash
cd server
npm run seed
```
This will create sample users and PG listings with proper MongoDB ObjectIds.

#### 3. Start the Backend Server
```bash
cd server
npm run dev
```

#### 4. Start the Frontend
```bash
cd client
npm start
```

### 🔍 Testing the Fix

After setup, the application should work properly. To test with existing data:

1. **Get all PGs**: `GET http://localhost:5000/api/pgs`
2. **Copy a valid ObjectId** from the response (e.g., `"_id": "6765abc123def456789..."`
3. **Use that ID in the URL** instead of "7"

### 📊 Database Structure

**Sample PG IDs after seeding:**
- PGs will have proper MongoDB ObjectIds (24-character hex strings)
- Reviews collection will be empty initially
- Users will have owner accounts for authentication

### 🛠️ Additional Improvements Made

1. **Consistent Error Response Format**:
   ```json
   {
     "success": false,
     "message": "Error description"
   }
   ```

2. **ObjectId Validation**:
   - All PG endpoints now validate ObjectId format
   - Returns 400 Bad Request for invalid IDs
   - Returns 404 Not Found for valid IDs that don't exist

3. **Enhanced Logging**:
   - Console error logging for debugging
   - Connection status indicators

### 🚫 Common Pitfalls Avoided

1. **Invalid ObjectIds**: Frontend should use valid MongoDB ObjectIds, not simple integers
2. **Database Connection**: Ensure MongoDB is running before starting the server
3. **CORS Issues**: Already handled in server configuration
4. **Authentication**: Review creation requires authentication token

### 📝 Complete Fix Steps

#### 1. Start MongoDB
```bash
# Ubuntu/WSL2
sudo systemctl start mongod

# macOS  
brew services start mongodb/brew/mongodb-community

# Windows
net start MongoDB
```

#### 2. Seed the Database (REQUIRED)
```bash
cd server
npm run seed
```

This creates **8 sample PGs** matching the frontend expectations.

#### 3. Start Backend Server
```bash
cd server
npm run dev
```

Should show: `✅ MongoDB connected successfully` and `Server running on port 5000`

#### 4. Start Frontend  
```bash
cd client
npm start
```

#### 5. Fix Frontend API Integration

The main issue is that **Listings.js uses mock data instead of real API calls**. 

**Current Issue**: 
- Frontend shows 8 PGs with simple IDs (1, 2, 3, 4, 5, 6, 7, 8)
- Backend only knows about MongoDB ObjectIds (24-character hex strings)
- When user clicks PG ID "7", backend receives "7" which is invalid ObjectId → 400 error

**Solution**: Replace mock data logic in `client/src/pages/Listings.js` with real API calls (see LISTINGS_FIX.js for example).

### 🎯 Expected Results After Fix

1. **Listings page**: Shows real PGs from database with proper MongoDB ObjectIds
2. **PG Details**: Clicking any PG opens details with correct ID
3. **All endpoints work**: `/api/pgs/[ObjectId]`, `/api/pgs/[ObjectId]/reviews`, `/api/pgs/similar/[ObjectId]`
4. **Error handling**: Invalid IDs return 400 with clear error messages

### 🧪 Testing

After seeding, test with curl:
```bash
# Get all PGs
curl http://localhost:5000/api/pgs

# Use real ObjectId from response (e.g., 6765abc123def456789...)
curl http://localhost:5000/api/pgs/6765abc123def456789...
```

### 🚨 Common Issues

1. **"Server not responding"** → MongoDB not running
2. **"Connection refused"** → Backend server not started  
3. **"PG not found"** → Database not seeded or using wrong ID format
4. **"Empty listings"** → Frontend still using mock data instead of API calls