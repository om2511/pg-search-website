import React from 'react';
import { 
  UserGroupIcon,
  ShieldCheckIcon,
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
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
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
      <div className="relative bg-gradient-to-br from-primary-900 via-secondary-900 to-accent-900 text-white py-24">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="relative container-responsive text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
            About FindMyPG
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-delay-200">
            We're on a mission to revolutionize how students and professionals find their perfect living spaces. 
            Making PG hunting stress-free, transparent, and efficient.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-dark-800">
        <div className="container-responsive">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center animate-bounce-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-right">
              <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
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
            
            <div className="animate-slide-left">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern PG Interior"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-800 dark:to-dark-900">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                To democratize access to quality living spaces by creating a transparent, 
                efficient, and trustworthy platform that connects property seekers with 
                verified PG owners across India.
              </p>
            </div>

            <div className="text-center lg:text-left animate-fade-in animate-delay-300">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-600 to-warning-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                To become India's most trusted and comprehensive platform for shared living, 
                where every student and professional can find their ideal home away from home 
                with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Passionate individuals working tirelessly to make your PG search experience exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="text-center group animate-zoom-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative inline-block mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-full group-hover:from-primary-600/40 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600">
        <div className="container-responsive text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect PG?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied residents who found their ideal living space through FindMyPG.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/listings" className="btn btn-ghost bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 btn-lg">
              Browse PGs
            </Link>
            <Link to="/add-pg" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-xl">
              List Your Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;