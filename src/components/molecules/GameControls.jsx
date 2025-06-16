import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const GameControls = ({ 
  onResetGame, 
  onResetScore, 
  gameMode, 
  onToggleGameMode,
  loading = false 
}) => {
  const controlsVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3, delay: 0.2 }
    }
  };

  return (
    <motion.div
      variants={controlsVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
    >
      <Button
        variant="primary"
        onClick={onResetGame}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <ApperIcon name="RotateCcw" className="w-4 h-4" />
        New Game
      </Button>

      <Button
        variant="outline"
        onClick={onToggleGameMode}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <ApperIcon name={gameMode === 'ai' ? 'Bot' : 'Users'} className="w-4 h-4" />
        {gameMode === 'ai' ? 'vs AI' : '2 Player'}
      </Button>

      <Button
        variant="ghost"
        onClick={onResetScore}
        disabled={loading}
        className="flex items-center gap-2 text-white/60 hover:text-white"
      >
        <ApperIcon name="Trash2" className="w-4 h-4" />
        Reset Score
      </Button>
    </motion.div>
  );
};

export default GameControls;