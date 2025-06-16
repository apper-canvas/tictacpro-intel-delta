import { motion } from 'framer-motion';

const GameCell = ({ 
  value, 
  onClick, 
  isWinning = false, 
  disabled = false,
  row,
  col
}) => {
  const cellVariants = {
    initial: { scale: 0.9, opacity: 0.8 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, opacity: 1 },
    tap: { scale: 0.95 }
  };

  const markVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    }
  };

  const getMarkColor = () => {
    if (value === 'X') return 'text-primary';
    if (value === 'O') return 'text-secondary';
    return 'text-transparent';
  };

  const getGlowClass = () => {
    if (isWinning && value === 'X') return 'shadow-neon-pink';
    if (isWinning && value === 'O') return 'shadow-neon-blue';
    return '';
  };

  return (
    <motion.button
      variants={cellVariants}
      initial="initial"
      animate="animate"
      whileHover={!disabled && !value ? "hover" : {}}
      whileTap={!disabled && !value ? "tap" : {}}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
        bg-surface border-2 border-white/20 rounded-lg
        flex items-center justify-center
        font-display text-4xl sm:text-5xl md:text-6xl font-bold
        transition-all duration-200
        ${!disabled && !value ? 'hover:border-accent hover:bg-surface/80 cursor-pointer' : ''}
        ${disabled || value ? 'cursor-not-allowed' : ''}
        ${getGlowClass()}
        ${isWinning ? 'animate-pulse' : ''}
      `}
      onClick={() => !disabled && !value && onClick(row, col)}
      disabled={disabled || !!value}
    >
      {value && (
        <motion.span
          variants={markVariants}
          initial="initial"
          animate="animate"
          className={`${getMarkColor()} ${isWinning ? 'neon-pulse' : ''}`}
        >
          {value}
        </motion.span>
      )}
      {!value && !disabled && (
        <motion.span 
          className="text-white/20 text-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        >
          +
        </motion.span>
      )}
    </motion.button>
  );
};

export default GameCell;