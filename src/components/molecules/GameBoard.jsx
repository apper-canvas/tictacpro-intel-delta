import { motion } from 'framer-motion';
import GameCell from '@/components/atoms/GameCell';

const GameBoard = ({ 
  board, 
  onCellClick, 
  winningCells = [], 
  disabled = false 
}) => {
  const boardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cellVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={boardVariants}
      initial="initial"
      animate="animate"
      className="relative"
    >
      <div className="grid grid-cols-3 gap-2 p-4 bg-surface/30 rounded-2xl backdrop-blur-sm border border-white/10">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellIndex = rowIndex * 3 + colIndex;
            const isWinning = winningCells.includes(cellIndex);
            
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                variants={cellVariants}
              >
                <GameCell
                  value={cell}
                  onClick={onCellClick}
                  isWinning={isWinning}
                  disabled={disabled}
                  row={rowIndex}
                  col={colIndex}
                />
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Winning line overlay */}
      {winningCells.length > 0 && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-4 bg-gradient-to-r from-success via-accent to-success opacity-80 rounded-xl win-line"></div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameBoard;