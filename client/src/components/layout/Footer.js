import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' }
    ],
    forRenters: [
      { name: 'Browse PGs', href: '/listings' },
      { name: 'Search by City', href: '/cities' },
      { name: 'PG Reviews', href: '/reviews' },
      { name: 'Rent Calculator', href: '/calculator' },
      { name: 'Moving Guide', href: '/guide' }
    ],
    forOwners: [
      { name: 'List Your PG', href: '/add-pg' },
      { name: 'Owner Dashboard', href: '/owner/dashboard' },
      { name: 'Pricing Plans', href: '/pricing' },
      { name: 'Marketing Tools', href: '/marketing' },
      { name: 'Owner Support', href: '/owner-support' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Safety Guidelines', href: '/safety' }
    ]
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Properties',
      description: 'Every PG is personally verified by our team'
    },
    {
      icon: CurrencyRupeeIcon,
      title: 'Zero Brokerage',
      description: 'Direct contact with owners, no hidden fees'
    },
    {
      icon: UserGroupIcon,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your needs'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Easy Communication',
      description: 'Connect instantly with PG owners'
    }
  ];

  return (
    <footer className="relative bg-gray-900 dark:bg-dark-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-hero-pattern"></div>
      </div>

      {/* Top Section - Features */}
      <div className="relative border-b border-gray-800 dark:border-dark-700">
        <div className="container-responsive py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Why Choose FindMyPG?</h3>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              We're committed to making your PG search experience seamless, safe, and successful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="text-center group animate-fade-in px-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-[1.02] transition-transform duration-300 shadow-lg">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative">
        <div className="container-responsive py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 sm:mb-6 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-[1.02]">
                  <img 
                    src="/logo.png" 
                    alt="FindMyPG Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-gradient-primary">
                    FindMyPG
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">Premium Living Spaces</p>
                </div>
              </Link>
              
              <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Your trusted platform for finding premium PG accommodations. We connect 
                students and professionals with verified, comfortable living spaces across India.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base break-words">123 Tech Hub, Ahmedabad, Gujarat 380001</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">+91 12345 67890</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                  <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base break-all">hello@findmypg.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                  <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base break-all">www.findmypg.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 dark:bg-dark-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-glow"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 sm:mt-0">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 sm:mt-0">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">For Renters</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.forRenters.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 sm:mt-0">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">For Owners</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.forOwners.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 sm:mt-0">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">Support</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm sm:text-base text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-800 dark:border-dark-700">
            <div className="max-w-2xl mx-auto text-center px-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                Get the latest PG listings, tips, and exclusive offers delivered to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 dark:bg-dark-800 border border-gray-700 dark:border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                />
                <button className="btn btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 dark:border-dark-700 bg-gray-950 dark:bg-dark-900">
        <div className="container-responsive py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              <span>© 2025 FindMyPG. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
                <span>in India</span>
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 sm:p-4 bg-gray-800 dark:bg-dark-800 rounded-xl hover:bg-gradient-to-r hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-glow"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </footer>
  );
};

export default Footer;