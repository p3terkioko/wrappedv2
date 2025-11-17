import React from 'react'
import ReactDOM from 'react-dom/client'
// import MinimalSpotify from './MinimalSpotify.jsx'
import App from './SpotifyWrapped.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)