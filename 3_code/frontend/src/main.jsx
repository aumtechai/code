import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// The Google Client ID is a PUBLIC identifier (not a secret).
// It is safe to commit. Only the Client Secret (backend-only) must stay private.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  || "413983791126-80rhdfihn5d892o9sug02pm053ug62u7.apps.googleusercontent.com";
console.log('[DEBUG] GOOGLE_CLIENT_ID =', GOOGLE_CLIENT_ID);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

