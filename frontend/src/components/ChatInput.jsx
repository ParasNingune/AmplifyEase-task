import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/ChatInput.module.css'

const ChatInput = ({ onSend, placeholder, primaryColor, disabled }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className={styles.input}
        disabled={disabled}
      />
      <motion.button
        type="submit"
        className={styles.sendButton}
        style={{ backgroundColor: primaryColor }}
        disabled={disabled || !message.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Send message"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
        </svg>
      </motion.button>
    </form>
  )
}

export default ChatInput
