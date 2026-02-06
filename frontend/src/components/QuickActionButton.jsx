import { useState } from 'react'
import styles from '../styles/QuickActionButton.module.css'

const QuickActionButton = ({ icon, label, onClick, primaryColor, disabled }) => {
  const [isHovered, setIsHovered] = useState(false)

  const buttonStyle = {
    borderColor: primaryColor,
    color: isHovered && !disabled ? 'white' : primaryColor,
    backgroundColor: isHovered && !disabled ? primaryColor : 'white',
  }

  return (
    <button 
      className={styles.quickActionButton}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}

export default QuickActionButton
