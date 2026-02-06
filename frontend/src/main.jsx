import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// For development
if (import.meta.env.DEV) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// For production embedding
window.ChatbotWidget = {
  init: (config = {}) => {
    const container = document.createElement('div')
    container.id = 'chatbot-widget-root'
    document.body.appendChild(container)
    
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <App config={config} />
      </React.StrictMode>
    )
  }
}
