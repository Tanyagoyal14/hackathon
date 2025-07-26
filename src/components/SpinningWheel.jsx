import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';

const SpinningWheel = ({ onClose }) => {
  const { games, spinWheel } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  
  // Filter out only locked games for the wheel
  const lockedGames = games.filter(game => 
    !result || game.id !== result.game?.id
  );
  
  // Calculate segment size based on number of games
  const segmentSize = 360 / lockedGames.length;
  
  // Prepare wheel segments colors
  const segmentColors = [
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-pink-500 to-purple-600',
    'from-red-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-yellow-500 to-orange-600',
    'from-green-500 to-teal-600',
    'from-teal-500 to-cyan-600',
    'from-cyan-500 to-blue-600',
    'from-blue-500 to-indigo-600',
    'from-indigo-500 to-violet-600',
    'from-violet-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-pink-500 to-rose-600',
    'from-rose-500 to-red-600',
    'from-red-500 to-orange-600',
    'from-orange-500 to-amber-600',
    'from-amber-500 to-yellow-600',
    'from-yellow-500 to-lime-600',
    'from-lime-500 to-green-600',
  ];
  
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Spin the wheel
    const spinResult = spinWheel();
    
    if (!spinResult.success) {
      setResult({ error: spinResult.message });
      setIsSpinning(false);
      return;
    }
    
    // Calculate rotation to land on the winning game
    const winningIndex = lockedGames.findIndex(game => game.id === spinResult.game.id);
    
    // Calculate total rotation (at least 5 full rotations + offset to the selected segment)
    // We subtract the winning segment position to ensure the wheel stops with the winning game at the top
    const totalRotation = 1800 + (360 - (winningIndex * segmentSize)) + (segmentSize / 2);
    
    // Set rotation with animation
    setRotationDegrees(totalRotation);
    
    // Wait for the wheel to stop spinning
    setTimeout(() => {
      setIsSpinning(false);
      setResult(spinResult);
    }, 4000); // Match this timing with the animation duration
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Spin to Win!</h3>
            <button 
              onClick={() => onClose()}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {result?.error ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{result.error}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Come back tomorrow for more spins!
              </p>
              <button
                onClick={() => onClose()}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          ) : result?.success ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Congratulations!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You unlocked a new game:
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-6">
                <div className="text-xl font-semibold mb-1">{result.game.name}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{result.game.description}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => onClose()}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Navigate to the game or perform any action needed
                    // For now, just close the modal
                    onClose();
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
                >
                  Play Now
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-64 h-64 mx-auto mb-8">
                {/* Center pointer */}
                <div className="absolute top-0 left-1/2 -ml-4 w-8 h-10 bg-yellow-500 clip-pointer z-10"></div>
                
                {/* Spinning wheel */}
                <motion.div
                  ref={wheelRef}
                  className="w-64 h-64 rounded-full relative overflow-hidden border-8 border-indigo-600"
                  style={{ 
                    transformOrigin: 'center', 
                    boxShadow: '0 0 0 8px rgba(79, 70, 229, 0.2)'
                  }}
                  animate={{ rotate: rotationDegrees }}
                  transition={{ duration: 4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Wheel segments */}
                  {lockedGames.map((game, index) => {
                    const rotation = index * segmentSize;
                    return (
                      <div
                        key={game.id}
                        className={`absolute w-full h-full bg-gradient-to-r ${segmentColors[index % segmentColors.length]}`}
                        style={{ 
                          transform: `rotate(${rotation}deg)`,
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(Math.PI / 180 * segmentSize)}% ${50 - 50 * Math.sin(Math.PI / 180 * segmentSize)}%, 50% 0%)`,
                          transformOrigin: 'center',
                        }}
                      >
                        <div 
                          className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white font-bold text-xs w-20 text-center"
                          style={{ transform: `translateX(-50%) rotate(${segmentSize / 2}deg)` }}
                        >
                          {game.name.length > 10 ? `${game.name.substring(0, 10)}...` : game.name}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                        {lockedGames.length}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`px-6 py-3 rounded-full font-medium shadow-lg transition ${
                    isSpinning
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
                </button>
              </div>
              
              <style jsx>{`
                .clip-pointer {
                  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
                }
              `}</style>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SpinningWheel;