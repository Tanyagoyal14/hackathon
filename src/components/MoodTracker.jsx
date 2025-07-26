import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MoodTracker = ({ currentMood, updateMood }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const moods = [
    { value: 'happy', label: 'Happy', emoji: '😀' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'tired', label: 'Tired', emoji: '😴' },
    { value: 'anxious', label: 'Anxious', emoji: '😟' },
    { value: 'distracted', label: 'Distracted', emoji: '🤔' },
    { value: 'frustrated', label: 'Frustrated', emoji: '😤' }
  ];

  const getCurrentMoodEmoji = () => {
    const found = moods.find(m => m.value === currentMood);
    return found ? found.emoji : '😐';
  };

  const getCurrentMoodLabel = () => {
    const found = moods.find(m => m.value === currentMood);
    return found ? found.label : 'Select Mood';
  };

  const handleSelectMood = (mood) => {
    updateMood(mood.value);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      >
        <span className="text-xl">{getCurrentMoodEmoji()}</span>
        <span className="text-sm font-medium">{getCurrentMoodLabel()}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showDropdown && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5"
        >
          {moods.map((mood) => (
            <button
              key={mood.value}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => handleSelectMood(mood)}
            >
              <span className="text-xl mr-2">{mood.emoji}</span>
              <span className={
                currentMood === mood.value 
                  ? 'font-medium text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-700 dark:text-gray-300'
              }>
                {mood.label}
              </span>
              
              {currentMood === mood.value && (
                <svg className="w-4 h-4 ml-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </button>
          ))}
          
          <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1 px-4 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your learning experience will be tailored to your mood
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodTracker;