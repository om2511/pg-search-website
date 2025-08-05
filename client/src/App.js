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
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/pg/:id" element={<PGDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-pg" element={<AddPG />} />
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