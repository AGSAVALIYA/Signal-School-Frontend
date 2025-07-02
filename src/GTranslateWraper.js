import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

/**
 * GTranslateComponent
 * 
 * This component integrates Google Translate functionality into the Signal School application.
 * It provides automatic language translation capabilities for the entire interface,
 * supporting multiple Indian languages to make the application accessible to
 * users who prefer languages other than English.
 * 
 * Features:
 * - Automatic browser language detection
 * - Support for English, Hindi, Marathi, and Gujarati
 * - Dynamic loading of Google Translate widget
 * - Cleanup of existing translate scripts to prevent conflicts
 * 
 * The component dynamically loads the Google Translate script and configures
 * it with specific language options suitable for the Indian education context.
 */
const GTranslateComponent = () => {

  /**
   * Effect hook to initialize Google Translate
   * 
   * This effect runs when the component mounts and:
   * 1. Removes any existing Google Translate scripts to prevent conflicts
   * 2. Configures the translate widget settings
   * 3. Dynamically loads the Google Translate script
   * 4. Appends the script to the document body
   */
  useEffect(() => {
    // Clean up any existing Google Translate scripts
    document.querySelectorAll('script').forEach((item) => {
        if (item.src.includes('gtranslate')) {
            item.remove();
        }
    });
    
    // Configure Google Translate settings
    window.gtranslateSettings = {
        "default_language": "en",           // Default language is English
        "detect_browser_language": true,    // Automatically detect user's browser language
        "languages": ["en", "hi", "mr", "gu"], // Supported languages: English, Hindi, Marathi, Gujarati
        "wrapper_selector": ".gtranslate_wrapper" // CSS selector for the translate widget container
    };
    
    // Create and configure the Google Translate script element
    const script = document.createElement('script');
    script.src = 'https://cdn.gtranslate.net/widgets/latest/lc.js';
    script.defer = true; // Load script after the document has finished loading
    
    // Add the script to the document
    document.body.appendChild(script);
  }, []);

  /**
   * Render method
   * 
   * Currently returns an empty fragment as the Google Translate widget
   * is rendered by the external script in elements with the class
   * 'gtranslate_wrapper' throughout the application.
   */
  return (
    <>
      {/* Google Translate widget will be rendered by the external script */}
    </> 
  );
};

export default GTranslateComponent;
