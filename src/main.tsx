import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './i18n'
import './styles.css'

// On GitHub Pages the app lives under /Lumen-Grove/ — tell the router where its root is.
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider><BrowserRouter basename={basename}><App /></BrowserRouter></HelmetProvider>
  </React.StrictMode>
)
