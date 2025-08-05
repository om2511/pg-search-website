import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PGDetails from './pages/PGDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AddPG from './pages/AddPG';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import OwnerDashboard from './pages/owner/Dashboard';
import axios from 'axios';

// Set base URL for API calls
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-colors duration-300">
                <Header />
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/pg/:id" element={<PGDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-pg" element={<AddPG />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;