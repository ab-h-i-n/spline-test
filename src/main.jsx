import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster/>
    <App />
  </StrictMode>,
)
