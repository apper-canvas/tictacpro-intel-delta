import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const GameResultModal = ({ isOpen, winner, isDraw, onClose }) => {
  // Auto-close modal after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    initial: { 
      scale: 0.3, 
      opacity: 0, 
      y: 50,
      rotateX: -15
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0, 
      y: 30,
      transition: { duration: 0.2 }
    }
  };

  const celebrationVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: [0, 1.2, 1], 
      rotate: [0, 360, 720],
      transition: {
        duration: 1.5,
        times: [0, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.7, 1, 0.7],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getResultContent = () => {
    if (winner) {
      return {
        title: `🎉 Player ${winner} Wins! 🎉`,
        subtitle: "Congratulations on your victory!",
        color: winner === 'X' ? 'text-primary' : 'text-secondary',
        bgColor: winner === 'X' ? 'bg-primary/20' : 'bg-secondary/20',
        borderColor: winner === 'X' ? 'border-primary/40' : 'border-secondary/40',
        icon: 'Trophy',
        emoji: winner === 'X' ? '❌' : '⭕'
      };
    }
    
    if (isDraw) {
      return {
        title: "🤝 It's a Draw! 🤝",
        subtitle: "Great game! Well played by both sides.",
        color: 'text-accent',
        bgColor: 'bg-accent/20',
        borderColor: 'border-accent/40',
        icon: 'Minus',
        emoji: '🤝'
      };
    }
    
    return null;
  };

  const result = getResultContent();

  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`
              relative w-full max-w-md mx-auto p-8 rounded-2xl backdrop-blur-md
              ${result.bgColor} ${result.borderColor} border-2
              shadow-2xl text-center
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Celebration Icons Background */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={sparkleVariants}
                  animate="animate"
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: `${10 + (i % 3) * 30}%`,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            {/* Main Trophy Icon */}
            <motion.div
              variants={celebrationVariants}
              initial="initial"
              animate="animate"
              className="flex justify-center mb-6"
            >
              <div className={`p-4 rounded-full ${result.bgColor} ${result.borderColor} border-2`}>
                <ApperIcon 
                  name={result.icon} 
                  className={`w-12 h-12 ${result.color}`}
                />
              </div>
            </motion.div>

            {/* Result Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`font-display text-2xl md:text-3xl font-bold mb-3 ${result.color}`}
            >
              {result.title}
            </motion.h2>

            {/* Result Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg mb-6"
            >
              {result.subtitle}
            </motion.p>

            {/* Animated Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                delay: 0.5,
                duration: 0.8,
                times: [0, 0.5, 1]
              }}
              className="text-4xl mb-6"
            >
              {result.emoji}
            </motion.div>

            {/* Close Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onClose}
                variant="outline"
                className="px-6 py-3 text-white border-white/30 hover:bg-white/10"
              >
                Continue Playing
              </Button>
            </motion.div>

            {/* Auto-close indicator */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/60 text-sm mt-4"
            >
              Auto-closing in 5 seconds...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameResultModal;