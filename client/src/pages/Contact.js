import React, { useState } from 'react';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: '+91 98765 43210',
      subtitle: 'Mon-Fri from 8am to 6pm',
      action: 'tel:+919876543210'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: 'support@findmypg.com',
      subtitle: 'We reply within 24 hours',
      action: 'mailto:support@findmypg.com'
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      details: 'Koramangala, Bangalore',
      subtitle: 'Visit us anytime',
      action: '#'
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      details: 'Mon - Fri: 8AM - 6PM',
      subtitle: 'Sat - Sun: 10AM - 4PM',
      action: '#'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: ChatBubbleLeftRightIcon },
    { value: 'support', label: 'Technical Support', icon: QuestionMarkCircleIcon },
    { value: 'complaint', label: 'Complaint', icon: ExclamationTriangleIcon },
    { value: 'feedback', label: 'Feedback', icon: HeartIcon }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800">
      {/* Header */}
      <section className="container-responsive mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gradient mb-6 animate-fade-in">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up animate-delay-200">
            Have questions about our services? Need help finding the perfect PG? 
            We're here to help and would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container-responsive mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <a
                key={info.title}
                href={info.action}
                className={`block p-6 bg-white dark:bg-dark-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-105 animate-scale-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {info.subtitle}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container-responsive">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-8 animate-slide-up">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <label
                          key={category.value}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            formData.category === category.value
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.value}
                            checked={formData.category === category.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <Icon className={`w-5 h-5 ${
                            formData.category === category.value
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.category === category.value
                              ? 'text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {category.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Brief subject of your message"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input resize-none"
                    placeholder="Tell us more about how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* FAQ Quick Links */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6 animate-slide-left">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Help
              </h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-gray-100">How to book a PG?</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step booking guide</p>
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Payment & Refunds</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment policies and refund process</p>
                </a>
                <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Property Verification</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How we verify listings</p>
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white animate-slide-left animate-delay-200">
              <h3 className="text-xl font-semibold mb-4">Response Time</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span>General inquiries: Within 2 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <span>Technical support: Within 4 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                  <span>Complaints: Within 1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;