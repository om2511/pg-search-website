# pg-search-website# <� PG Search Website

A modern, full-stack MERN application for finding and managing Paying Guest (PG) accommodations. Built with React 19, Node.js, Express, and MongoDB, featuring a beautiful UI, comprehensive search functionality, and powerful owner management tools.

## < Features

### =
 For Guests
- **Smart Search & Filtering**: Advanced search with location, price range, amenities, and gender preferences
- **Interactive Maps**: Google Maps integration with location visualization
- **Detailed PG Profiles**: Comprehensive information with photo galleries, amenities, and reviews
- **Wishlist Management**: Save and organize favorite properties
- **Review System**: Read and write authentic reviews from verified users
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

### <� For Property Owners
- **Owner Dashboard**: Comprehensive analytics and property management interface
- **Property Listings**: Add, edit, and manage PG listings with rich media support
- **Inquiry Management**: Track and respond to guest inquiries
- **Analytics & Insights**: View booking statistics, revenue tracking, and performance metrics
- **Multi-Image Upload**: Support for property photos with automatic optimization
- **Real-time Updates**: Live updates on availability and booking status

### =� Security & Authentication
- **JWT Authentication**: Secure token-based authentication system
- **Role-based Access**: Separate interfaces for guests and property owners
- **Input Validation**: Comprehensive data validation and sanitization
- **Security Headers**: Helmet.js integration for enhanced security
- **Rate Limiting**: Protection against API abuse and spam

## =� Tech Stack

### Frontend
- **React 19.1.1** - Latest React with concurrent features
- **React Router DOM 7.7.1** - Client-side routing
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Headless UI 2.2.7** - Unstyled, accessible UI components
- **Heroicons 2.2.0** - Beautiful hand-crafted SVG icons
- **Axios 1.11.0** - Promise-based HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Fast, unopinionated web framework
- **MongoDB** - Document-based NoSQL database
- **Mongoose 8.17.0** - MongoDB object modeling library
- **JWT** - JSON Web Token for authentication
- **bcryptjs 3.0.2** - Password hashing library
- **Multer 2.0.2** - File upload middleware

### Development Tools
- **Create React App** - React build toolchain
- **Nodemon** - Auto-restart development server
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **dotenv** - Environment variable management

## =� Installation & Setup

### Prerequisites
- **Node.js 16+** - [Download](https://nodejs.org/)
- **MongoDB 4.4+** - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- **Git** - [Download](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pg-search-website.git
cd pg-search-website
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Configuration

#### Client Environment (.env)
Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

#### Server Environment (.env)
Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pg-search
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

### 4. Database Setup

#### Start MongoDB
```bash
# Ubuntu/WSL2
sudo systemctl start mongod

# macOS (Homebrew)
brew services start mongodb/brew/mongodb-community

# Windows
net start MongoDB
```

#### Seed the Database
```bash
cd server
npm run seed
```

This creates sample data including:
- 8 PG listings with proper MongoDB ObjectIds
- Owner and guest user accounts
- Sample reviews and ratings

### 5. Start the Application

#### Development Mode (Recommended)
```bash
# Terminal 1: Start Backend Server
cd server
npm run dev

# Terminal 2: Start Frontend Development Server
cd client
npm start
```

#### Production Mode
```bash
# Build the frontend
cd client
npm run build

# Start the backend server
cd ../server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## <� Design System

The application features a comprehensive design system built with Tailwind CSS:

### Color Palette
- **Primary**: Indigo-blue gradient (#4f46e5 � #6366f1)
- **Secondary**: Emerald-teal (#059669 � #10b981)
- **Accent**: Rose-pink (#db2777 � #ec4899)
- **Success**: Green variants (#10b981)
- **Warning**: Amber variants (#f59e0b)
- **Error**: Red variants (#ef4444)

### Typography
- **Primary Font**: Inter (with Poppins and cursive fallbacks)
- **Size Scale**: 14 responsive typography sizes
- **Line Heights**: Optimized for readability

### Components
- **Cards**: Elevated design with hover effects
- **Buttons**: 5 variants with animations
- **Forms**: Consistent input styling
- **Badges**: Status and category indicators
- **Loading States**: Skeleton screens and spinners

### Animations
- **Transitions**: Smooth 300ms transitions
- **Keyframes**: Fade, slide, zoom, and bounce effects
- **Hover States**: Interactive feedback
- **Page Transitions**: Route-based animations

## =� API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "guest" // or "owner"
}
```

#### POST /api/auth/login
Authenticate user credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### PG Management Endpoints

#### GET /api/pgs
Get all PG listings with optional filtering.

**Query Parameters:**
- `city` - Filter by city
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `gender` - Gender preference (boys/girls/both)
- `amenities` - Comma-separated amenities list

#### GET /api/pgs/:id
Get detailed information for a specific PG.

#### POST /api/pgs (Auth Required)
Create a new PG listing (Owner only).

#### PUT /api/pgs/:id (Auth Required)
Update an existing PG listing (Owner only).

#### DELETE /api/pgs/:id (Auth Required)
Delete a PG listing (Owner only).

### Review Endpoints

#### GET /api/pgs/:id/reviews
Get all reviews for a specific PG.

#### POST /api/pgs/:id/reviews (Auth Required)
Add a review for a PG.

### Owner Dashboard Endpoints

#### GET /api/owner/dashboard (Auth Required)
Get owner dashboard analytics.

#### GET /api/owner/inquiries (Auth Required)
Get property inquiries for owner.

## =� Performance

### Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP support with fallbacks
- **Caching**: Service worker for offline support
- **Bundle Size**: Optimized with tree shaking

### Backend Optimization
- **Database Indexing**: Optimized queries
- **Rate Limiting**: API protection
- **Compression**: Gzip response compression
- **Caching**: Redis integration ready