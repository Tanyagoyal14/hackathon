import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      id: 'games', 
      name: 'Games', 
      icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5' 
    },
    { 
      id: 'progress', 
      name: 'My Progress', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' 
    },
    { 
      id: 'paths', 
      name: 'Learning Paths', 
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' 
    },
    { 
      id: 'rewards', 
      name: 'Rewards', 
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' 
    },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 shadow-sm w-64 hidden md:block">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-600 dark:text-indigo-200 font-medium text-lg">
              S
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Student</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Level 2 Explorer</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>XP Progress</span>
              <span>250/500 XP</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
        
        <nav className="mt-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md transition ${
                    activeItem === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                  onClick={() => setActiveItem(item.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4"
          >
            <div className="flex items-center text-indigo-600 dark:text-indigo-400">
              <span className="text-xl mr-2">🎮</span>
              <h3 className="font-medium">Daily Challenge</h3>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Complete a math challenge and earn 50 XP points
            </p>
            <button className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition">
              Start Challenge
            </button>
          </motion.div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;