import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// DEBUG: Log the client ID so we can verify which value is loaded
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "VITE_VAR_NOT_SET";
console.log('%c[DEBUG] VITE_GOOGLE_CLIENT_ID =', 'color: orange; font-size: 14px;', GOOGLE_CLIENT_ID);
console.log('%c[DEBUG] All VITE env vars =', 'color: orange; font-size: 14px;', import.meta.env);

// Show debug banner on page if key is missing or wrong 
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.error('[DEBUG] CRITICAL: VITE_GOOGLE_CLIENT_ID is NOT SET in this build!');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
