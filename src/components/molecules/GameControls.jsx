import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
const GameControls = ({ 
  onResetGame, 
  onResetScore, 
  gameMode, 
  onToggleGameMode,
  aiDifficulty,
  onDifficultyChange,
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
      className="flex flex-col justify-center items-center gap-4 mt-8"
    >
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
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
      </div>

      {gameMode === 'ai' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
className="flex items-center gap-3"
        >
          <span className="text-white/80 text-sm">AI Difficulty:</span>
          <select
            value={aiDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            disabled={loading}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 rounded-lg px-3 py-1 text-sm text-white shadow-neon-pink focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-neon-pink"
          >
            <option value="easy" className="bg-surface text-white">Easy</option>
            <option value="medium" className="bg-surface text-white">Medium</option>
            <option value="hard" className="bg-surface text-white">Hard</option>
          </select>
        </motion.div>
      )}

</motion.div>
  );
};

export default GameControls;