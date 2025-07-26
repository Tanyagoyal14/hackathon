import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import GameCard from '../components/GameCard';
import SpinningWheel from '../components/SpinningWheel';
import LearningPathCard from '../components/LearningPathCard';
import MoodTracker from '../components/MoodTracker';
import RewardBadge from '../components/RewardBadge';
import DailyRecommendation from '../components/DailyRecommendation';
import ProgressTracker from '../components/ProgressTracker';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { games, unlockedGames, spinsLeft, spinWheel, currentSpin } = useGame();

  const [surveyData, setSurveyData] = useState(null);
  const [showSpinResult, setShowSpinResult] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [showSpinningWheel, setShowSpinningWheel] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState('daily');

  // Load survey data and ensure games are loaded
  useEffect(() => {
    const loadSurveyData = () => {
      try {
        const storedData = localStorage.getItem('surveyData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setSurveyData(parsedData);
          
          // If we have survey data but no unlocked games, trigger game recommendations
          if (unlockedGames.length === 0 && games.length > 0) {
            console.log('Survey data found but no unlocked games, updating recommendations');
            // Use the updateGamesFromSurvey function from the existing useGame hook
            if (updateGamesFromSurvey) {
              updateGamesFromSurvey(parsedData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading survey data:', error);
      }
    };

    loadSurveyData();

    // Show welcome modal on first dashboard visit
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
    
    // Debug games data
    console.log('Dashboard loaded - Games:', games);
    console.log('Dashboard loaded - Unlocked Games:', unlockedGames);
    
    // Check localStorage for unlockedGames
    try {
      const storedGames = localStorage.getItem('unlockedGames');
      console.log('Stored games in localStorage:', storedGames);
      
      // If we have stored games but unlockedGames is empty, try to load them
      if (storedGames && unlockedGames.length === 0 && games.length > 0) {
        const gameIds = JSON.parse(storedGames);
        console.log('Found stored game IDs but no unlocked games, attempting to load:', gameIds);
        
        // Find the full game objects from the generated games
        const fullUnlockedGames = games.filter(game => 
          gameIds.includes(game.id)
        ).map(game => ({...game, unlocked: true}));
        
        if (fullUnlockedGames.length > 0) {
          console.log('Successfully loaded unlocked games from localStorage');
        }
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  }, [games, unlockedGames]);

  // Badges and achievements
  const badges = [
    { id: 'first-login', name: 'First Day', icon: '🌟', color: 'bg-yellow-100' },
    { id: 'survey-complete', name: 'Profile Complete', icon: '📋', color: 'bg-blue-100' },
    { id: 'first-game', name: 'Game Explorer', icon: '🎮', color: 'bg-purple-100' },
    { id: 'learning-path', name: 'Path Starter', icon: '🧭', color: 'bg-green-100' },
    { id: 'mood-tracker', name: 'Mood Aware', icon: '😊', color: 'bg-pink-100' }
  ];

  // Learning paths
  const learningPaths = [
    {
      id: 'math-foundations',
      title: 'Math Foundations',
      description: 'Build essential math skills with progressively challenging activities',
      progress: 15,
      totalSteps: 30,
      image: 'https://placehold.co/300x150/4f46e5/ffffff?text=Math+Foundations'
    },
    {
      id: 'reading-adventures',
      title: 'Reading Adventures',
      description: 'Explore stories and improve reading comprehension',
      progress: 8,
      totalSteps: 25,
      image: 'https://placehold.co/300x150/8b5cf6/ffffff?text=Reading+Adventures'
    },
    {
      id: 'science-explorer',
      title: 'Science Explorer',
      description: 'Discover scientific concepts through interactive experiments',
      progress: 3,
      totalSteps: 20,
      image: 'https://placehold.co/300x150/06b6d4/ffffff?text=Science+Explorer'
    }
  ];

  // Handle spinning the wheel
  const handleSpin = () => {
    // Show the spinning wheel modal
    setShowSpinningWheel(true);
  };

  // Handle closing the spinning wheel modal
  const handleCloseSpinningWheel = () => {
    setShowSpinningWheel(false);
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);

    // Save mood history in localStorage
    const now = new Date();
    const moodEntry = {
      mood,
      timestamp: now.toISOString()
    };

    try {
      const storedMoods = localStorage.getItem('moodHistory');
      let moodHistory = [];

      if (storedMoods) {
        moodHistory = JSON.parse(storedMoods);
      }

      // Add new mood to history
      moodHistory.push(moodEntry);

      // Keep only the last 30 entries
      if (moodHistory.length > 30) {
        moodHistory = moodHistory.slice(moodHistory.length - 30);
      }

      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    } catch (error) {
      console.error('Error saving mood history:', error);
    }
  };

  // Close welcome modal and mark as seen
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  // Render tabs content based on active tab
  const renderTabContent = () => {
    switch (activeDashboardTab) {
      case 'daily':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Daily Learning Plan</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <DailyRecommendation />
              </div>
              <div className="lg:col-span-2">
                <ProgressTracker />
              </div>
            </div>
          </div>
        );
        
      case 'games':
        return (
          <div className="space-y-6">
            {/* Unlocked Games */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {surveyData?.ageGroup ? `Games for ${surveyData.ageGroup === '4-7' ? '4-7 years' : surveyData.ageGroup === '8-12' ? '8-12 years' : surveyData.ageGroup === '13-17' ? '13-17 years' : surveyData.ageGroup}` : 'Your Unlocked Games'}
              </h2>

              {unlockedGames && unlockedGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlockedGames
                    .filter(game => {
                      // Always show unlocked games regardless of age group
                      // This ensures games are visible after survey completion
                      return true;
                    })
                    .map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No games unlocked yet. Spin the wheel to discover new games!</p>
                </div>
              )}
            </div>

            {/* Game Discovery */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left md:max-w-md">
                  <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">Unlock New Games</h3>
                  <p className="text-indigo-600/70 dark:text-indigo-300/70 mb-4">
                    Spin the wheel to discover new learning games tailored to your interests.
                    You have {spinsLeft} spins left today.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpin}
                    disabled={spinsLeft <= 0}
                    className={`px-6 py-3 rounded-full font-medium shadow-md transition ${spinsLeft > 0
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                      }`}
                  >
                    Spin the Wheel
                  </motion.button>
                </div>

                <div className="md:flex-shrink-0">
                  {/* Wheel icon or preview */}
                  <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🎡</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Games Preview */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Games to Discover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games
                  .filter(game => !unlockedGames.some(unlocked => unlocked.id === game.id))
                  .filter(game => {
                    // Filter games by age group if surveyData exists
                    if (surveyData?.ageGroup) {
                      const ageRange = surveyData.ageGroup.split('-').map(Number);
                      // Check if game's age range overlaps with user's age range
                      return game.ageRange[0] <= ageRange[1] && game.ageRange[1] >= ageRange[0];
                    }
                    return true; // Show all games if no age filter
                  })
                  .slice(0, 3)
                  .map(game => (
                    <GameCard key={game.id} game={{ ...game, locked: true }} />
                  ))}
              </div>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Learning Paths</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningPaths.map(path => (
                <LearningPathCard key={path.id} path={path} />
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Daily Learning Streak</h3>

              <div className="flex space-x-2 overflow-x-auto pb-4">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${i < 5
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                      }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                <strong>5-day streak!</strong> Keep it up to unlock special rewards.
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Achievements</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Earned Badges</h3>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {badges.map(badge => (
                  <RewardBadge key={badge.id} badge={badge} />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Progress Report</h3>

              <div className="space-y-4">
                {['Time Spent Learning', 'Activities Completed', 'Skills Mastered'].map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat}</span>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {index === 0 ? '45 minutes' : index === 1 ? '7 activities' : '3 skills'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: index === 0 ? '45%' : index === 1 ? '70%' : '30%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'mood':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Mood Tracker</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">How are you feeling today?</h3>

              <MoodTracker onSelectMood={handleMoodSelect} currentMood={currentMood} />

              {currentMood && (
                <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                    Personalized for your {currentMood.label} mood
                  </h4>
                  <p className="text-indigo-600/80 dark:text-indigo-300/80 text-sm">
                    {currentMood.id === 'happy' && "That's great! We've selected some challenging activities to match your positive energy."}
                    {currentMood.id === 'calm' && "Perfect for focused learning! We've curated activities that require concentration."}
                    {currentMood.id === 'tired' && "Let's keep it light today. We've selected some easier, more engaging activities."}
                    {currentMood.id === 'sad' && "We've picked some uplifting and encouraging activities to help improve your mood."}
                    {currentMood.id === 'frustrated' && "Let's work on something different. We've selected activities to help you reset."}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Mood History</h3>

              <div className="flex flex-wrap gap-2">
                {[...Array(7)].map((_, i) => {
                  const moodOptions = ['happy', 'calm', 'tired', 'sad', 'frustrated'];
                  const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));

                  return (
                    <div key={i} className="flex flex-col items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${randomMood === 'happy' ? 'bg-yellow-100 text-yellow-600' :
                        randomMood === 'calm' ? 'bg-blue-100 text-blue-600' :
                          randomMood === 'tired' ? 'bg-purple-100 text-purple-600' :
                            randomMood === 'sad' ? 'bg-indigo-100 text-indigo-600' :
                              'bg-red-100 text-red-600'
                        }`}>
                        {randomMood === 'happy' ? '😃' :
                          randomMood === 'calm' ? '😌' :
                            randomMood === 'tired' ? '😴' :
                              randomMood === 'sad' ? '😢' : '😤'}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {date.toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute top-10 right-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-20 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {surveyData?.name || currentUser?.name || 'Friend'}!
              </h1>
              {surveyData?.ageGroup && (
                <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg inline-block mb-3">
                  <span className="text-lg mr-2">👤</span>
                  <span className="font-semibold">Age Group: {surveyData.ageGroup === '4-7' ? '4-7 years' : 
                                                 surveyData.ageGroup === '8-12' ? '8-12 years' : 
                                                 surveyData.ageGroup === '13-17' ? '13-17 years' : surveyData.ageGroup}</span>
                </div>
              )}
              <p className="text-indigo-100 mb-4 max-w-xl">
                Your personalized learning hub is ready. Start exploring games, track your progress, and earn rewards as you learn!
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
                  <span className="text-lg mr-2">🎮</span>
                  <div>
                    <div className="text-xs text-indigo-100">Unlocked Games</div>
                    <div className="font-semibold">{unlockedGames.length} / {games.length}</div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
                  <span className="text-lg mr-2">⭐</span>
                  <div>
                    <div className="text-xs text-indigo-100">Achievements</div>
                    <div className="font-semibold">{badges.length} Badges</div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg flex items-center">
                  <span className="text-lg mr-2">🔄</span>
                  <div>
                    <div className="text-xs text-indigo-100">Spins Left</div>
                    <div className="font-semibold">{spinsLeft} Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'daily', label: 'Daily Plan', icon: '📝' },
                { id: 'games', label: 'Games', icon: '🎮' },
                { id: 'learning', label: 'Learning Paths', icon: '🧭' },
                { id: 'achievements', label: 'Achievements', icon: '🏆' },
                { id: 'mood', label: 'Mood Tracker', icon: '😊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDashboardTab(tab.id)}
                  className={`py-4 px-1 flex items-center space-x-2 border-b-2 font-medium text-sm transition ${activeDashboardTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Age Group Display */}
          {surveyData?.ageGroup && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Selected Age Group</h2>
              <div className="flex items-center justify-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                <div className="text-5xl mr-4">👤</div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {surveyData.ageGroup === '4-7' ? '4-7 years' : 
                   surveyData.ageGroup === '8-12' ? '8-12 years' : 
                   surveyData.ageGroup === '13-17' ? '13-17 years' : surveyData.ageGroup}
                </div>
              </div>
              <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
                All content and games are tailored for this age group
              </p>
            </div>
          )}

          {/* Tab Content */}
          <div className="pb-12">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* New Game Unlocked Modal */}
      <AnimatePresence>
        {showSpinResult && spinResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl"
            >
              <div className="mb-4 text-5xl">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                New Game Unlocked!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You've discovered a new game to add to your collection.
              </p>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                <img
                  src={spinResult.image}
                  alt={spinResult.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {spinResult.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {spinResult.description}
                </p>
              </div>

              <button
                onClick={() => setShowSpinResult(false)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
              >
                Start Playing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Modal for first-time users */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full shadow-xl"
            >
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Welcome to Your Learning Hub!
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-full text-indigo-600 dark:text-indigo-400 text-xl">
                    🎮
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Personalized Games</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Explore games tailored to your learning style and interests.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-full text-purple-600 dark:text-purple-400 text-xl">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Learning Paths</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Follow guided paths to build skills progressively.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full text-blue-600 dark:text-blue-400 text-xl">
                    🏆
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Earn Rewards</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Collect badges and unlock new games as you learn.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full text-green-600 dark:text-green-400 text-xl">
                    😊
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Mood Tracking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tell us how you're feeling for more personalized content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleCloseWelcomeModal}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                >
                  Let's Start Learning!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinning Wheel Modal */}
      <AnimatePresence>
        {showSpinningWheel && (
          <SpinningWheel onClose={handleCloseSpinningWheel} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;