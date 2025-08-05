// src/utils/analytics.js
export const initGA = () => {
  if (typeof window !== 'undefined') {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};