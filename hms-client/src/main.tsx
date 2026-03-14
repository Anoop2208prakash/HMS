import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import setupLocatorUI from '@locator/runtime'
// import './index.css' // Your global styles

// Enable Locator only in development
if (import.meta.env.DEV) {
  setupLocatorUI()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)