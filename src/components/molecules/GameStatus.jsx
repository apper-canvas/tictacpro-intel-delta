import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameStatus = ({ 
  winner, 
  isDraw, 
  currentPlayer, 
  gameMode 
}) => {
  const statusVariants = {
    initial: { scale: 0.8, opacity: 0, y: 10 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    },
    exit: { scale: 0.8, opacity: 0, y: -10 }
  };

  const getStatusMessage = () => {
    if (winner) {
      return {
        message: `Player ${winner} Wins!`,
        color: winner === 'X' ? 'text-primary' : 'text-secondary',
        icon: 'Trophy',
        bgColor: winner === 'X' ? 'bg-primary/10' : 'bg-secondary/10',
        borderColor: winner === 'X' ? 'border-primary/30' : 'border-secondary/30'
      };
    }
    
    if (isDraw) {
      return {
        message: "It's a Draw!",
        color: 'text-accent',
        icon: 'Minus',
        bgColor: 'bg-accent/10',
        borderColor: 'border-accent/30'
      };
    }
    
    return {
      message: `Player ${currentPlayer}'s Turn`,
      color: currentPlayer === 'X' ? 'text-primary' : 'text-secondary',
      icon: currentPlayer === 'X' ? 'X' : 'Circle',
      bgColor: currentPlayer === 'X' ? 'bg-primary/10' : 'bg-secondary/10',
      borderColor: currentPlayer === 'X' ? 'border-primary/30' : 'border-secondary/30'
    };
  };

  const status = getStatusMessage();

  return (
    <div className="text-center mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${winner}-${isDraw}-${currentPlayer}`}
          variants={statusVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`
            inline-flex items-center gap-3 px-6 py-3 rounded-full
            ${status.bgColor} ${status.borderColor} border-2
            backdrop-blur-sm
          `}
        >
          <ApperIcon 
            name={status.icon} 
            className={`w-6 h-6 ${status.color}`}
          />
          <span className={`font-display text-xl ${status.color}`}>
            {status.message}
          </span>
          {(winner || isDraw) && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ApperIcon 
                name="Sparkles" 
                className="w-5 h-5 text-accent"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GameStatus;