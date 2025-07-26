import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    let timer;
    if (isVisible) {
      // Auto-close notification after 2 seconds
      timer = setTimeout(() => {
        onClose();
      }, 2000);
    }
    
    // Cleanup function to clear the timeout when component unmounts or isVisible changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, onClose]);

  // Define styles based on notification type
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/40',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: '✓'
        };
      case 'error':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/40',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: '✗'
        };
      default:
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/40',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: 'ℹ'
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 ${styles.bgColor} ${styles.textColor} ${styles.borderColor} border rounded-lg shadow-lg p-4 flex items-center max-w-md`}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-lg">
            {styles.icon}
          </div>
          <div className="flex-grow">
            <p className="font-medium">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;