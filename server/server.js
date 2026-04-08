const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

const app = express();

// CORS configuration
const localOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
];

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS || '').split(','),
]
  .map((origin) => origin && origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...localOrigins, ...configuredOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images
  contentSecurityPolicy: false, // Disable CSP for development
}));
app.use(morgan('combined'));
app.use(cors(corsOptions));

// Increase payload limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving with proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pgs', require('./routes/pgs'));
app.use('/api/owner', require('./routes/owner'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/inquiries', require('./routes/inquiries'));

// Database connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pg-search', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('📝 Please ensure MongoDB is running and accessible at:', process.env.MONGODB_URI || 'mongodb://localhost:27017/pg-search');
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
