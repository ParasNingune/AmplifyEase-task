import { motion } from 'framer-motion'
import styles from '../styles/QuickReply.module.css'

const QuickReply = ({ option, onClick, primaryColor }) => {
  return (
    <motion.button
      className={styles.quickReply}
      onClick={() => onClick(option.value)}
      style={{ 
        borderColor: primaryColor,
        color: primaryColor
      }}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: primaryColor,
        color: 'white'
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {option.label}
    </motion.button>
  )
}

export default QuickReply
