import React from 'react';
import { motion } from 'framer-motion';

const LearningPathCard = ({ path }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl">
              {path.icon}
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">{path.title}</h3>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded text-xs font-medium text-blue-700 dark:text-blue-300">
            {path.progress}% Complete
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {path.description}
        </p>
        
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${path.progress}%` }}
          ></div>
        </div>
        
        {path.games && path.games.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Included Games:
            </p>
            <div className="flex flex-wrap gap-2">
              {path.games.map((gameId, index) => (
                <div 
                  key={gameId}
                  className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-600 dark:text-gray-300"
                >
                  Game {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            View Details
          </button>
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition">
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningPathCard;