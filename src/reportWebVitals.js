/**
 * Web Vitals Reporting Utility
 * 
 * This utility function measures and reports Core Web Vitals metrics for the
 * Signal School Frontend application. These metrics help monitor and optimize
 * the user experience by tracking key performance indicators.
 * 
 * Core Web Vitals Measured:
 * - CLS (Cumulative Layout Shift): Visual stability during page load
 * - FID (First Input Delay): Interactivity and responsiveness
 * - FCP (First Contentful Paint): Loading performance
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 * 
 * Usage:
 * Pass a callback function to receive performance data, which can be:
 * - Logged to console for development
 * - Sent to analytics services for monitoring
 * - Used for performance optimization decisions
 * 
 * @param {Function} onPerfEntry - Callback function to handle performance entries
 */
const reportWebVitals = (onPerfEntry) => {
  // Verify that a valid callback function was provided
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import web-vitals library to avoid affecting bundle size
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Measure Cumulative Layout Shift - tracks visual stability
      getCLS(onPerfEntry);
      
      // Measure First Input Delay - tracks interactivity
      getFID(onPerfEntry);
      
      // Measure First Contentful Paint - tracks loading performance
      getFCP(onPerfEntry);
      
      // Measure Largest Contentful Paint - tracks loading performance
      getLCP(onPerfEntry);
      
      // Measure Time to First Byte - tracks server response time
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
