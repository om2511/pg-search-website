import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Load from localStorage for non-authenticated users
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (pgId) => {
    if (wishlist.some(item => item._id === pgId || item === pgId)) {
      return; // Already in wishlist
    }

    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/user/wishlist', { pgId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchWishlist(); // Refresh wishlist
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    } else {
      // Save to localStorage for non-authenticated users
      const newWishlist = [...wishlist, pgId];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = async (pgId) => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/user/wishlist/${pgId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchWishlist(); // Refresh wishlist
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      // Remove from localStorage
      const newWishlist = wishlist.filter(item => item !== pgId && item._id !== pgId);
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  const isInWishlist = (pgId) => {
    return wishlist.some(item => item._id === pgId || item === pgId);
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('/api/user/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist([]);
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    } else {
      setWishlist([]);
      localStorage.removeItem('wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};