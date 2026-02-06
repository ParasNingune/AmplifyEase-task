import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/ChatbotWidget.module.css'
import ChatMessage from './ChatMessage'
import QuickReply from './QuickReply'
import QuickActionButton from './QuickActionButton'
import ChatInput from './ChatInput'

const ChatbotWidget = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      addBotMessage({
        message: config.welcomeMessage,
        type: 'text',
        options: null
      })
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addBotMessage = (response) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: response.message,
      sender: 'bot',
      type: response.type || 'text',
      options: response.options || null,
      timestamp: new Date()
    }])
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'user',
      type: 'text',
      timestamp: new Date()
    }])
  }

  const sendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message
    addUserMessage(message)

    // Show typing indicator
    setIsTyping(true)

    try {
      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          user_data: {}
        })
      })

      const data = await response.json()

      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false)
        addBotMessage(data)
      }, 800)

    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      addBotMessage({
        message: 'Sorry, I\'m having trouble connecting. Please try again later.',
        type: 'text',
        options: null
      })
    }
  }

  const handleQuickReply = (value) => {
    sendMessage(value)
  }

  const resetConversation = async () => {
    try {
      // Call backend reset endpoint
      await fetch(`${config.apiUrl}/api/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      })
    } catch (error) {
      console.error('Error resetting session:', error)
    }

    // Clear messages and restart
    setMessages([])
    setIsTyping(false)
    
    // Add welcome message again
    setTimeout(() => {
      addBotMessage({
        message: config.welcomeMessage,
        type: 'text',
        options: null
      })
    }, 300)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`${styles.chatbotContainer} ${styles[config.position]}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div 
              className={styles.chatHeader}
              style={{ background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${adjustColor(config.primaryColor, -20)} 100%)` }}
            >
              <div className={styles.headerContent}>
                <div className={styles.avatar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="white"/>
                  </svg>
                </div>
                <div className={styles.headerText}>
                  <h3>{config.title}</h3>
                  <p>{config.subtitle}</p>
                </div>
              </div>
              <div className={styles.headerButtons}>
                <button 
                  className={styles.resetButton}
                  onClick={resetConversation}
                  aria-label="Reset conversation"
                  title="Start new conversation"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="white"/>
                  </svg>
                </button>
                <button 
                  className={styles.closeButton}
                  onClick={toggleChat}
                  aria-label="Close chat"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  primaryColor={config.primaryColor}
                />
              ))}

              {isTyping && (
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies - Contextual from bot response */}
            {messages.length > 0 && messages[messages.length - 1].options && (
              <div className={styles.quickReplies}>
                {messages[messages.length - 1].options.map((option, index) => (
                  <QuickReply
                    key={index}
                    option={option}
                    onClick={handleQuickReply}
                    primaryColor={config.primaryColor}
                  />
                ))}
              </div>
            )}

            {/* Permanent Quick Action Buttons - Only show when no contextual replies */}
            {!(messages.length > 0 && messages[messages.length - 1].options) && (
              <div className={styles.quickActionBar}>
                <QuickActionButton
                  icon="📦"
                  label="Products"
                  onClick={() => sendMessage('Product Info')}
                  primaryColor={config.primaryColor}
                  disabled={isTyping}
                />
                <QuickActionButton
                  icon="💰"
                  label="Pricing"
                  onClick={() => sendMessage('Pricing')}
                  primaryColor={config.primaryColor}
                  disabled={isTyping}
                />
                <QuickActionButton
                  icon="📅"
                  label="Demo"
                  onClick={() => sendMessage('Schedule Demo')}
                  primaryColor={config.primaryColor}
                  disabled={isTyping}
                />
                <QuickActionButton
                  icon="🆘"
                  label="Help"
                  onClick={() => sendMessage('Support')}
                  primaryColor={config.primaryColor}
                  disabled={isTyping}
                />
              </div>
            )}

            {/* Input */}
            <ChatInput 
              onSend={sendMessage}
              placeholder={config.placeholder}
              primaryColor={config.primaryColor}
              disabled={isTyping}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        className={styles.chatButton}
        onClick={toggleChat}
        style={{ backgroundColor: config.primaryColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" fill="white"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  const clamp = (val) => Math.min(Math.max(val, 0), 255)
  const num = parseInt(color.replace('#', ''), 16)
  const r = clamp((num >> 16) + amount)
  const g = clamp(((num >> 8) & 0x00FF) + amount)
  const b = clamp((num & 0x0000FF) + amount)
  return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export default ChatbotWidget
