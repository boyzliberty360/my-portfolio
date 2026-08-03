import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'  // Tailwind

const canonicalUrl = window.location.origin;
const canonicalLink = document.querySelector('link[rel="canonical"]');
const openGraphUrl = document.querySelector('meta[property="og:url"]');
if (canonicalLink) canonicalLink.href = canonicalUrl;
if (openGraphUrl) openGraphUrl.content = canonicalUrl;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
