# 🚀 Deployment Guide

This guide covers deploying the PG Search Website to various platforms.

## 📋 Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Build process working (`npm run build`)
- [ ] All tests passing
- [ ] Security configurations reviewed

## 🌐 Frontend Deployment (Netlify/Vercel)

### Netlify Deployment

1. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: build
   ```

2. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

3. **Redirects** (create `public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Vercel Deployment

1. **vercel.json** configuration:
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "build" }
       }
     ],
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "dest": "/index.html" }
     ]
   }
   ```

## 🔧 Backend Deployment (Heroku/Railway/DigitalOcean)

### Heroku Deployment

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-app-name`
4. **Add MongoDB**: `heroku addons:create mongolab:sandbox`
5. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-production-secret
   heroku config:set MONGODB_URI=your-mongodb-uri
   ```
6. **Deploy**: `git push heroku main`

### Railway Deployment

1. **Connect GitHub repository**
2. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   ```
3. **Start Command**: `node server.js`

### DigitalOcean App Platform

1. **App Spec** (`.do/app.yaml`):
   ```yaml
   name: pg-search-backend
   services:
   - name: api
     source_dir: /server
     github:
       repo: your-username/pg-search-website
       branch: main
     run_command: node server.js
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${DATABASE_URL}
     - key: JWT_SECRET
       value: ${JWT_SECRET}
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create cluster** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create database user** with read/write permissions
3. **Whitelist IP addresses** or allow from anywhere (0.0.0.0/0)
4. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/pg-search?retryWrites=true&w=majority
   ```

### Self-hosted MongoDB

1. **Install MongoDB** on your server
2. **Configure authentication**
3. **Set up SSL/TLS** for secure connections
4. **Configure firewall** rules

## 🔒 Security Considerations

### Environment Variables

Never commit these to version control:
```bash
# Production secrets
JWT_SECRET=your-super-secure-production-secret
MONGODB_URI=mongodb+srv://...
EMAIL_PASS=your-email-app-password
```

### CORS Configuration

Update `server.js` for production:
```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  credentials: true
};
```

### Security Headers

Ensure Helmet is properly configured:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

## 📊 Monitoring & Maintenance

### Health Checks

Add health check endpoint in `server.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging

Configure production logging:
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
```

### Error Tracking

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for user session recording
- **Google Analytics** for usage analytics

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        npm install
        cd client && npm install
        cd ../server && npm install
        
    - name: Run tests
      run: npm test
      
    - name: Build frontend
      run: cd client && npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Check frontend URL in backend CORS configuration
2. **Database Connection**: Verify MongoDB URI and network access
3. **Environment Variables**: Ensure all required env vars are set
4. **Build Failures**: Check Node.js version compatibility
5. **File Upload Issues**: Verify file upload directory permissions

### Debug Commands

```bash
# Check environment variables
heroku config

# View logs
heroku logs --tail

# Connect to database
mongo "mongodb+srv://cluster.mongodb.net/test" --username username

# Test API endpoints
curl https://your-api-url.com/health
```

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Netlify Deployment Guide](https://docs.netlify.com/site-deploys/create-deploys/)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)