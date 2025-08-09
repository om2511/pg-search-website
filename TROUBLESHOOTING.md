# 🛠️ PG Search Website - Troubleshooting Guide

A comprehensive guide to diagnose and resolve common issues in the PG Search Website application.

## 📋 Quick Diagnostics

### Health Check Commands
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check if backend server is responsive
curl -f http://localhost:5000/api/health || echo "Backend server not responding"

# Check if frontend dev server is running
curl -f http://localhost:3000 || echo "Frontend server not responding"

# Verify environment variables
cd server && node -e "console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)"
```

### System Requirements Check
```bash
# Node.js version (required: 16+)
node --version

# npm version
npm --version

# MongoDB version (required: 4.4+)
mongod --version

# Check available disk space (required: 1GB+)
df -h
```

---

## 🚨 Common Issues & Solutions

### 1. Database Connection Issues

#### Issue: "MongoDB connection failed" or "MongoNetworkError"

**Symptoms:**
- Server crashes on startup with connection error
- API endpoints return 500 errors
- Console shows: `MongoNetworkError: connect ECONNREFUSED`

**Root Causes:**
- MongoDB service not running
- Incorrect MONGODB_URI in environment variables
- MongoDB not installed or configured properly

**Solutions:**

##### Start MongoDB Service
```bash
# Ubuntu/WSL2
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on boot
sudo systemctl status mongod  # Check status

# macOS (Homebrew)
brew services start mongodb/brew/mongodb-community
brew services list | grep mongodb  # Check status

# Windows
net start MongoDB
# OR using MongoDB Compass GUI

# Docker (Alternative)
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

##### Verify Database Connection
```bash
# Test connection manually
mongosh mongodb://localhost:27017/pg-search

# In mongosh, run:
use pg-search
db.stats()
```

##### Fix Environment Variables
```bash
# Check current MongoDB URI
cd server
node -e "console.log('MONGODB_URI:', process.env.MONGODB_URI)"

# Create/update server/.env
echo "MONGODB_URI=mongodb://localhost:27017/pg-search" >> .env
```

##### Advanced MongoDB Issues
```bash
# Clear MongoDB logs (if corrupted)
sudo rm /var/log/mongodb/mongod.log
sudo systemctl restart mongod

# Repair MongoDB database
mongod --repair --dbpath /var/lib/mongodb

# Check MongoDB configuration
cat /etc/mongod.conf
```

### 2. API Integration & ObjectId Issues

#### Issue: "Invalid ObjectId format" or "PG not found" errors

**Symptoms:**
- PG details page shows 400/404 errors
- API returns "Cast to ObjectId failed"
- Frontend logs: `AxiosError: Request failed with status code 400`

**Root Causes:**
- Frontend using mock IDs (1, 2, 3) instead of MongoDB ObjectIds
- Database not seeded with proper data
- Listings.js using hardcoded mock data

**Solutions:**

##### Seed Database with Proper Data
```bash
cd server
npm run seed  # Creates 8 PGs with valid ObjectIds

# Verify seeding worked
mongosh pg-search --eval "db.pgs.find({}, {_id:1, name:1}).limit(3)"
```

##### Fix Frontend API Integration
The main issue is `client/src/pages/Listings.js` using mock data instead of real API calls.

**Current Problem:**
```javascript
// Listings.js currently has mock data like:
const mockPGs = [
  { _id: '1', name: 'Mock PG 1' },  // Invalid ObjectId!
  { _id: '2', name: 'Mock PG 2' },  // Invalid ObjectId!
  // ...
];
```

**Fix by replacing with real API calls:**
```javascript
// In Listings.js, replace mock data with:
useEffect(() => {
  const fetchPGs = async () => {
    try {
      const response = await axios.get('/api/pgs');
      setPgs(response.data.data);  // Real PGs with valid ObjectIds
    } catch (error) {
      console.error('Error fetching PGs:', error);
    }
  };
  fetchPGs();
}, []);
```

##### Validate ObjectIds in Backend
The backend already includes ObjectId validation. Verify it's working:

```javascript
// Test ObjectId validation
curl http://localhost:5000/api/pgs/invalid-id
# Should return: {"success": false, "message": "Invalid PG ID format"}

curl http://localhost:5000/api/pgs/507f1f77bcf86cd799439011
# Should return: {"success": false, "message": "PG not found"}
```

### 3. Authentication Issues

#### Issue: "Token invalid" or "Authentication failed"

**Symptoms:**
- Login succeeds but subsequent API calls fail with 401
- JWT token not being stored/sent properly
- Protected routes redirect to login

**Solutions:**

##### Check JWT Configuration
```bash
# Verify JWT_SECRET exists and is strong
cd server
node -e "console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length)"
# Should be at least 32 characters

# Test JWT generation
node -e "const jwt=require('jsonwebtoken'); console.log('JWT test:', jwt.sign({test:1}, process.env.JWT_SECRET))"
```

##### Debug Token Storage (Frontend)
```javascript
// Check if token is stored in localStorage
console.log('Stored token:', localStorage.getItem('token'));

// Check if Axios is sending Authorization header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

##### Reset Authentication
```bash
# Clear all tokens and restart
# In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();

# In server, invalidate all sessions by changing JWT_SECRET:
cd server
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### 4. Image Upload & Display Issues

#### Issue: Images not uploading or displaying correctly

**Symptoms:**
- Image upload fails with 500 error
- Images upload but don't display (broken links)
- Photo gallery modal shows blank images

**Solutions:**

##### Check Upload Directory Permissions
```bash
cd server
ls -la uploads/  # Should show proper permissions

# Fix permissions if needed
chmod 755 uploads/
sudo chown $USER:$USER uploads/

# Ensure uploads directory exists
mkdir -p uploads
```

##### Verify Image Serving Configuration
```javascript
// In server.js, ensure static file serving is configured:
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
```

##### Test Image Upload
```bash
# Test image upload endpoint
curl -X POST -F "image=@test-image.jpg" http://localhost:5000/api/upload

# Test image access
curl -I http://localhost:5000/uploads/avatar-1234567890-123456789.jpg
```

##### Fix Image Display (Photo Gallery Modal)
The photo gallery modal was recently fixed to handle:
- Proper image URL construction
- Error handling with fallback placeholders
- Responsive layout and scrolling
- Visible close button

### 5. Frontend Build Issues

#### Issue: "Module not found" or build failures

**Symptoms:**
- npm start fails with dependency errors
- Build process crashes
- Missing module errors

**Solutions:**

##### Clear Dependencies and Reinstall
```bash
cd client
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If still failing, check Node version
node --version  # Should be 16+
npm --version   # Should be 8+
```

##### Fix Common React Issues
```bash
# Update React Scripts if needed
npm install react-scripts@latest

# Fix ESLint configuration conflicts
echo "SKIP_PREFLIGHT_CHECK=true" >> .env

# Clear React cache
rm -rf node_modules/.cache
```

### 6. CORS & Network Issues

#### Issue: "CORS policy" or "Network Error" in browser

**Symptoms:**
- API calls fail with CORS errors
- Browser console shows cross-origin errors
- Network requests blocked

**Solutions:**

##### Check CORS Configuration
```javascript
// In server.js, verify CORS options:
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};
```

##### Test API Endpoints Directly
```bash
# Test backend API directly
curl -H "Content-Type: application/json" http://localhost:5000/api/pgs

# Test with CORS headers
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:5000/api/pgs
```

##### Check Proxy Configuration
```json
// In client/package.json, ensure proxy is set:
{
  "name": "pg-search-frontend",
  "proxy": "http://localhost:5000"
}
```

---

## 🔧 Environment-Specific Issues

### Development Environment

#### Issue: Hot reloading not working

**Solutions:**
```bash
# For React hot reloading issues
cd client
echo "FAST_REFRESH=true" >> .env
echo "WDS_SOCKET_HOST=localhost" >> .env

# For backend hot reloading with nodemon
cd server
npx nodemon --inspect server.js
```

#### Issue: Port conflicts

**Solutions:**
```bash
# Check what's using port 3000/5000
lsof -i :3000
lsof -i :5000

# Kill processes if needed
kill -9 $(lsof -t -i:3000)

# Use alternative ports
cd client
PORT=3001 npm start

cd server
PORT=5001 npm run dev
```

### Production Environment

#### Issue: Environment variables not loaded

**Solutions:**
```bash
# Check environment variables in production
printenv | grep -E "(NODE_ENV|PORT|MONGODB_URI|JWT_SECRET)"

# Load environment variables explicitly
node -r dotenv/config server.js

# Use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

#### Issue: Static file serving in production

**Solutions:**
```javascript
// In server.js for production build serving:
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

---

## 🐛 Debugging Tools & Commands

### Backend Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check MongoDB queries
cd server
node --inspect server.js
# Then open chrome://inspect

# Test API endpoints with detailed output
curl -v http://localhost:5000/api/pgs

# Monitor MongoDB operations
mongosh pg-search --eval "db.setLogLevel(1)"
```

### Frontend Debugging

```javascript
// Enable Redux DevTools (if using Redux)
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

// Debug API calls
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Debug Context values
console.log('Auth Context:', useContext(AuthContext));
```

### Database Debugging

```bash
# Check database contents
mongosh pg-search
> db.pgs.countDocuments()
> db.users.find({}, {name:1, email:1})
> db.reviews.aggregate([{$group: {_id: "$pg", count: {$sum: 1}}}])

# Check indexes
> db.pgs.getIndexes()

# Analyze slow queries
> db.setProfilingLevel(2)
> db.system.profile.find().sort({ts: -1}).limit(5)
```

---

## 📊 Performance Issues

### Frontend Performance

#### Issue: Slow page loads or UI lag

**Solutions:**
```bash
# Analyze bundle size
cd client
npm run build
npm install -g source-map-explorer
npx source-map-explorer 'build/static/js/*.js'

# Enable React Profiler
# In React DevTools, use Profiler tab

# Optimize images
# Convert images to WebP format
# Use proper image dimensions
```

### Backend Performance

#### Issue: Slow API responses

**Solutions:**
```bash
# Add database indexes
mongosh pg-search
> db.pgs.createIndex({ "location.city": 1 })
> db.pgs.createIndex({ price: 1 })
> db.pgs.createIndex({ gender: 1 })
> db.pgs.createIndex({ amenities: 1 })

# Monitor API response times
# Add Morgan logging to see request timing

# Enable compression
npm install compression
```

---

## 🆘 Emergency Recovery

### Complete Reset (Nuclear Option)

```bash
# Stop all services
pkill -f "node.*server.js"
pkill -f "react-scripts"

# Clean MongoDB
mongosh pg-search --eval "db.dropDatabase()"

# Clean all dependencies
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
cd client && npm install
cd ../server && npm install

# Reseed database
cd server && npm run seed

# Restart services
npm run dev  # In server directory
npm start    # In client directory (new terminal)
```

### Backup & Restore Database

```bash
# Backup database
mongodump --db pg-search --out backup/

# Restore database
mongorestore --db pg-search backup/pg-search/

# Export specific collection
mongoexport --db pg-search --collection pgs --out pgs-backup.json

# Import specific collection
mongoimport --db pg-search --collection pgs --file pgs-backup.json
```

---

## 📞 Getting Additional Help

### Log Collection
Before seeking help, collect these logs:

```bash
# Server logs
cd server
npm run dev > server.log 2>&1 &
tail -f server.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Client logs (check browser console)
# Network tab in DevTools
# React error boundary logs
```

### System Information
```bash
# OS information
uname -a
lsb_release -a  # Linux
sw_vers        # macOS

# Node ecosystem
node --version
npm --version
npx --version

# MongoDB info
mongod --version
mongosh --version
```

### Community Support
- 🐛 **Report Issues**: GitHub Issues with system info and logs
- 💬 **Discord**: Real-time community support
- 📧 **Email**: support@pgwebsite.com for urgent issues
- 📚 **Documentation**: Check API docs and guides

---

**🔍 Still having issues?** Create a GitHub issue with:
1. System information (OS, Node.js, MongoDB versions)
2. Complete error messages and stack traces  
3. Steps to reproduce the issue
4. Logs from both frontend and backend
5. Screenshots/videos if UI-related

We're here to help! 🚀