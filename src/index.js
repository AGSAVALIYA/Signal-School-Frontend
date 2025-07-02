import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

/**
 * Application Entry Point
 * 
 * This file is the main entry point for the Signal School Frontend React application.
 * It sets up the root rendering context with all necessary providers and configurations.
 * 
 * Key Setup Components:
 * - ThemeProvider: Applies the custom Material-UI theme throughout the app
 * - CssBaseline: Provides consistent baseline styles across browsers
 * - BrowserRouter: Enables client-side routing for the single-page application
 * - Service Worker: Configured for offline functionality (currently unregistered)
 * - Web Vitals: Performance monitoring setup
 */

// Create the root element for React 18's new createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application with all necessary providers
root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline provides consistent baseline styles and applies theme background */}
    <CssBaseline  />
    {/* BrowserRouter enables client-side routing throughout the app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

// Service Worker Configuration
// Currently unregistered - can be changed to register() for offline functionality
// Service workers enable features like offline support and background sync
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// Performance Monitoring Setup
// Web Vitals measures key performance metrics for the application
// Can be configured to log results or send to analytics endpoints
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
