import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon,
  MapPinIcon,
  TrophyIcon,
  HeartIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { number: '1,500+', label: 'Verified PGs', icon: BuildingOfficeIcon },
    { number: '25,000+', label: 'Happy Residents', icon: UserGroupIcon },
    { number: '50+', label: 'Cities Covered', icon: MapPinIcon },
    { number: '99%', label: 'Customer Satisfaction', icon: TrophyIcon }
  ];

  const team = [
    {
      name: 'Arjun Sharma',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Former Google engineer passionate about solving housing problems for students and professionals.'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bio: 'Expert in property verification and quality assurance with 8+ years of experience.'
    },
    {
      name: 'Rahul Kumar',
      role: 'Technology Lead',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Full-stack developer building the future of property search and management.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="relative container-responsive text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            About FindMyPG
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed animate-slide-up animate-delay-200 px-4 sm:px-0">
            We're on a mission to revolutionize how students and professionals find their perfect living spaces. 
            Making PG hunting stress-free, transparent, and efficient.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-dark-800">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center animate-bounce-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium px-1">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 sm:py-20 lg:py-24">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            <div className="animate-slide-right order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Our Story
              </h2>
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  FindMyPG was born out of a personal struggle. Our founder, Arjun, spent weeks 
                  searching for a decent PG in Mumbai, dealing with brokers, visiting countless 
                  properties, and facing numerous disappointments.
                </p>
                <p>
                  That's when he realized there had to be a better way. A platform where students 
                  and professionals could find verified, quality PG accommodations without the 
                  hassle of brokers and hidden fees.
                </p>
                <p>
                  Today, we're proud to have helped thousands of people find their perfect home 
                  away from home, and we're just getting started.
                </p>
              </div>
            </div>
            
            <div className="animate-slide-left order-1 lg:order-2">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern PG Interior"
                  className="rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-800 dark:to-dark-900">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4 sm:mb-6 shadow-lg">
                <TrophyIcon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">Our Mission</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                To democratize access to quality living spaces by creating a transparent, 
                efficient, and trustworthy platform that connects property seekers with 
                verified PG owners across India.
              </p>
            </div>

            <div className="text-center lg:text-left animate-fade-in animate-delay-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-r from-accent-600 to-warning-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4 sm:mb-6 shadow-lg">
                <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">Our Vision</h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                To become India's most trusted and comprehensive platform for shared living, 
                where every student and professional can find their ideal home away from home 
                with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 sm:py-20 lg:py-24">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Passionate individuals working tirelessly to make your PG search experience exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {team.map((member, index) => (
              <div 
                key={index}
                className="text-center group animate-zoom-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative inline-block mb-4 sm:mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover mx-auto shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-full group-hover:from-primary-600/40 transition-all duration-300"></div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base px-2 sm:px-0">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600">
        <div className="container-responsive text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to Find Your Perfect PG?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-md sm:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-2 sm:px-0">
            Join thousands of satisfied residents who found their ideal living space through FindMyPG.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 px-4 sm:px-0">
            <Link to="/listings" className="btn btn-ghost bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 btn-lg w-full sm:w-auto text-sm sm:text-base">
              Browse PGs
            </Link>
            <Link to="/add-pg" className="btn bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 btn-lg shadow-xl w-full sm:w-auto text-sm sm:text-base">
              List Your Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
