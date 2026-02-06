import { useState } from 'react'
import ChatbotWidget from './components/ChatbotWidget'
import './styles/App.css'

function App({ config = {} }) {
  const defaultConfig = {
    apiUrl: 'http://localhost:5001', //'https://amplifyease-task.onrender.com'
    primaryColor: '#667eea',
    position: 'bottom-right',
    title: 'Chat with us!',
    subtitle: 'We reply instantly ⚡',
    placeholder: 'Type a message...',
    welcomeMessage: 'Hi there! 👋 How can I help you today?',
    ...config
  }

  return (
    <div className="app">
      <ChatbotWidget config={defaultConfig} />
    </div>
  )
}

export default App
