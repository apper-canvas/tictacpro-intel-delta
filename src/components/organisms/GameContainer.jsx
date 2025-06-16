import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GameBoard from "@/components/molecules/GameBoard";
import ScoreBoard from "@/components/molecules/ScoreBoard";
import GameStatus from "@/components/molecules/GameStatus";
import GameControls from "@/components/molecules/GameControls";
import GameResultModal from "@/components/molecules/GameResultModal";
import { gameStateService, scoreService } from "@/services";

const GameContainer = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [gameState, setGameState] = useState({
    board: [['', '', ''], ['', '', ''], ['', '', '']],
    currentPlayer: 'X',
    winner: null,
    winningCells: [],
    isDraw: false,
    gameMode: 'two-player'
  });
const [score, setScore] = useState({ playerX: 0, playerO: 0, draws: 0 });
  const [aiDifficulty, setAiDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    initializeGame();
  }, [isAuthenticated]);
  useEffect(() => {
    if (gameState.gameMode === 'ai' && 
        gameState.currentPlayer === 'O' && 
        !gameState.winner && 
        !gameState.isDraw) {
      handleAIMove();
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, gameState.isDraw]);

const initializeGame = async () => {
    setLoading(true);
    try {
      const [gameData, scoreData] = await Promise.all([
        gameStateService.getGameState(),
        scoreService.getScore()
      ]);
      
      if (gameData) {
        setGameState(gameData);
      } else {
        toast.error('Failed to load game state');
      }
      
      if (scoreData) {
        setScore(scoreData);
      } else {
        toast.error('Failed to load score');
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      toast.error('Failed to initialize game');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (row, col) => {
    if (loading || aiThinking || gameState.board[row][col] || gameState.winner || gameState.isDraw) {
      return;
    }

    setLoading(true);
try {
      const newGameState = await gameStateService.makeMove(row, col, gameState.currentPlayer);
      
      if (newGameState) {
        setGameState(newGameState);

// Update score if game ended
        if (newGameState.winner || newGameState.isDraw) {
          const winner = newGameState.winner || 'draw';
          const newScore = await scoreService.updateScore(winner);
          
          if (newScore) {
            setScore(newScore);
          }
          
          // Show celebration modal
          setShowResultModal(true);
          
          // Keep existing toast notifications
          if (newGameState.winner) {
            toast.success(`Player ${newGameState.winner} wins!`, {
              icon: newGameState.winner === 'X' ? '❌' : '⭕'
            });
          } else if (newGameState.isDraw) {
            toast.info("It's a draw!", { icon: '🤝' });
          }
        }
      } else {
        toast.error('Failed to make move');
      }
    } catch (error) {
      console.error('Error making move:', error);
      toast.error('Failed to make move');
    } finally {
      setLoading(false);
    }
  };

  const handleAIMove = async () => {
    if (gameState.winner || gameState.isDraw) return;
    
setAiThinking(true);
    try {
      const aiMove = await gameStateService.getAIMove(aiDifficulty);
      if (aiMove) {
        setTimeout(() => {
          handleCellClick(aiMove.row, aiMove.col);
          setAiThinking(false);
        }, 500); // Add delay for better UX
      }
    } catch (error) {
      toast.error('AI move failed');
      setAiThinking(false);
    }
  };

const handleResetGame = async () => {
    setLoading(true);
    try {
      const newGameState = await gameStateService.resetGame();
      
      if (newGameState) {
        setGameState({ ...newGameState, gameMode: gameState.gameMode });
        setShowResultModal(false); // Close modal when starting new game
        toast.success('New game started!');
      } else {
        toast.error('Failed to reset game');
      }
    } catch (error) {
      console.error('Error resetting game:', error);
      toast.error('Failed to reset game');
    } finally {
      setLoading(false);
    }
  };

const handleResetScore = async () => {
    setLoading(true);
    try {
      const newScore = await scoreService.resetScore();
      
      if (newScore) {
        setScore(newScore);
        toast.success('Score reset!');
      } else {
        toast.error('Failed to reset score');
      }
    } catch (error) {
      console.error('Error resetting score:', error);
      toast.error('Failed to reset score');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGameMode = async () => {
    const newMode = gameState.gameMode === 'two-player' ? 'ai' : 'two-player';
    setLoading(true);
try {
      const newGameState = await gameStateService.updateGameState({ gameMode: newMode });
      
      if (newGameState) {
        setGameState(newGameState);
        await handleResetGame();
        toast.success(`Switched to ${newMode === 'ai' ? 'AI mode' : 'two-player mode'}!`);
      } else {
        toast.error('Failed to switch game mode');
      }
    } catch (error) {
      console.error('Error switching game mode:', error);
      toast.error('Failed to switch game mode');
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setAiDifficulty(newDifficulty);
    toast.success(`AI difficulty set to ${newDifficulty}!`);
  };
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-surface/20"
    >
      <div className="w-full max-w-md mx-auto">
        <motion.h1 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center font-display text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        >
          TicTacPro
        </motion.h1>

        <ScoreBoard score={score} currentPlayer={gameState.currentPlayer} />
        
        <GameStatus
          winner={gameState.winner}
          isDraw={gameState.isDraw}
          currentPlayer={gameState.currentPlayer}
          gameMode={gameState.gameMode}
        />

        <div className="flex justify-center mb-6">
          <GameBoard
            board={gameState.board}
            onCellClick={handleCellClick}
            winningCells={gameState.winningCells || []}
            disabled={loading || aiThinking || !!gameState.winner || gameState.isDraw}
          />
        </div>

        {aiThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
<div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full"
              />
              <span className="text-secondary text-sm">AI is thinking...</span>
            </div>
</motion.div>
        )}

        <GameControls
          onResetGame={handleResetGame}
          onResetScore={handleResetScore}
          gameMode={gameState.gameMode}
          onToggleGameMode={handleToggleGameMode}
          aiDifficulty={aiDifficulty}
          onDifficultyChange={handleDifficultyChange}
          loading={loading || aiThinking}
        />
      </div>

      {/* Game Result Modal */}
      <GameResultModal
        isOpen={showResultModal}
        winner={gameState.winner}
        isDraw={gameState.isDraw}
        onClose={() => setShowResultModal(false)}
      />
    </motion.div>
  );
};

export default GameContainer;