import { motion } from 'framer-motion';

const ScoreBoard = ({ score, currentPlayer }) => {
  const scoreVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const playerVariants = {
    active: { 
      scale: 1.1, 
      boxShadow: '0 0 20px currentColor',
      transition: { duration: 0.2 }
    },
    inactive: { 
      scale: 1, 
      boxShadow: 'none',
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={scoreVariants}
      initial="initial"
      animate="animate"
      className="flex justify-center items-center gap-8 mb-8"
    >
      <motion.div
        variants={playerVariants}
        animate={currentPlayer === 'X' ? 'active' : 'inactive'}
        className="text-center p-4 rounded-xl bg-surface/50 border border-primary/30"
      >
        <div className="text-primary font-display text-2xl mb-1">X</div>
        <div className="text-white font-bold text-xl">{score.playerX}</div>
        <div className="text-white/60 text-sm">Player X</div>
      </motion.div>

      <div className="text-center">
        <div className="text-white/40 text-sm mb-1">VS</div>
        <div className="text-accent font-bold text-lg">{score.draws}</div>
        <div className="text-white/60 text-xs">Draws</div>
      </div>

      <motion.div
        variants={playerVariants}
        animate={currentPlayer === 'O' ? 'active' : 'inactive'}
        className="text-center p-4 rounded-xl bg-surface/50 border border-secondary/30"
      >
        <div className="text-secondary font-display text-2xl mb-1">O</div>
        <div className="text-white font-bold text-xl">{score.playerO}</div>
        <div className="text-white/60 text-sm">Player O</div>
      </motion.div>
    </motion.div>
  );
};

export default ScoreBoard;