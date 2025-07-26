import React from 'react';
import { motion } from 'framer-motion';

const RewardBadge = ({ badge }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center"
    >
      <div 
        className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center text-3xl shadow-sm`}
      >
        {badge.icon}
      </div>
      <p className="mt-2 text-xs font-medium text-center text-gray-700 dark:text-gray-300">
        {badge.name}
      </p>
    </motion.div>
  );
};

export default RewardBadge;