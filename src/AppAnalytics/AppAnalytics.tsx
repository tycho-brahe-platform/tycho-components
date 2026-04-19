import { useEffect } from 'react';

export default function AppAnalytics() {
  const GA_ID = import.meta.env.VITE_APP_GA_ID;

  useEffect(() => {
    if (!GA_ID) {
      console.warn('Google Analytics ID not set.');
      return;
    }

    // Inject the gtag.js script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Inject the inline gtag config script exactly like GA docs do
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(inlineScript);
  }, []);

  return null;
}
