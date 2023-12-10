import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

const GTranslateComponent = () => {

  useEffect(() => {
    document.querySelectorAll('script').forEach((item) => {
        if (item.src.includes('gtranslate')) {
            item.remove();
        }
        }
    );
    window.gtranslateSettings = {
        "default_language": "en",
        "detect_browser_language": true,
        "languages": ["en", "hi", "mr", "gu"],
        "wrapper_selector": ".gtranslate_wrapper"
        };
    const script = document.createElement('script');
    script.src = 'https://cdn.gtranslate.net/widgets/latest/lc.js';
   

    script.defer = true;
    
    document.body.appendChild(script);


   
  }, []);



  return (
    <>
      
    </> 
  );
};

export default GTranslateComponent;
