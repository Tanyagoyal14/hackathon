import React, { createContext, useContext, useState, useEffect } from 'react';
import gameRecommender from '../utils/mlModel';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [unlockedGames, setUnlockedGames] = useState([]);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [currentSpin, setCurrentSpin] = useState(null);
  
  // Generate initial games
  useEffect(() => {
    const initializeGames = () => {
      const generatedGames = [
        {
          id: 'math-puzzle',
          name: 'Math Puzzle Adventure',
          description: 'Solve math puzzles and earn rewards',
          category: 'math',
          difficulty: 'adaptive',
          ageRange: [7, 12],
          image: 'https://placehold.co/300x200/4f46e5/ffffff?text=Math+Puzzle',
          unlocked: false
        },
        {
          id: 'word-explorer',
          name: 'Word Explorer',
          description: 'Build vocabulary through fun word games',
          category: 'language',
          difficulty: 'moderate',
          ageRange: [8, 14],
          image: 'https://placehold.co/300x200/8b5cf6/ffffff?text=Word+Explorer',
          unlocked: false
        },
        {
          id: 'science-lab',
          name: 'Science Laboratory',
          description: 'Virtual experiments for young scientists',
          category: 'science',
          difficulty: 'moderate',
          ageRange: [9, 14],
          image: 'https://placehold.co/300x200/06b6d4/ffffff?text=Science+Lab',
          unlocked: false
        },
        {
          id: 'memory-match',
          name: 'Memory Match',
          description: 'Boost memory skills with matching cards',
          category: 'cognitive',
          difficulty: 'easy',
          ageRange: [5, 10],
          image: 'https://placehold.co/300x200/f97316/ffffff?text=Memory+Match',
          unlocked: false
        },
        {
          id: 'shape-sorter',
          name: 'Shape Sorter',
          description: 'Improve visual recognition and motor skills',
          category: 'motor',
          difficulty: 'easy',
          ageRange: [5, 8],
          image: 'https://placehold.co/300x200/14b8a6/ffffff?text=Shape+Sorter',
          unlocked: false
        },
        {
          id: 'rhythm-beats',
          name: 'Rhythm Beats',
          description: 'Learn patterns and sequence through music',
          category: 'arts',
          difficulty: 'moderate',
          ageRange: [6, 12],
          image: 'https://placehold.co/300x200/db2777/ffffff?text=Rhythm+Beats',
          unlocked: false
        },
        {
          id: 'story-creator',
          name: 'Story Creator',
          description: 'Create your own stories with animated characters',
          category: 'language',
          difficulty: 'moderate',
          ageRange: [8, 14],
          image: 'https://placehold.co/300x200/84cc16/ffffff?text=Story+Creator',
          unlocked: false
        },
        {
          id: 'logic-puzzles',
          name: 'Logic Puzzles',
          description: 'Brain teasers to develop logical thinking',
          category: 'logic',
          difficulty: 'hard',
          ageRange: [10, 16],
          image: 'https://placehold.co/300x200/0ea5e9/ffffff?text=Logic+Puzzles',
          unlocked: false
        },
        {
          id: 'pattern-blocks',
          name: 'Pattern Blocks',
          description: 'Create and recognize geometric patterns',
          category: 'math',
          difficulty: 'easy',
          ageRange: [6, 10],
          image: 'https://placehold.co/300x200/f59e0b/ffffff?text=Pattern+Blocks',
          unlocked: false
        },
        {
          id: 'animal-facts',
          name: 'Animal Facts',
          description: 'Learn about animals through interactive quizzes',
          category: 'science',
          difficulty: 'easy',
          ageRange: [7, 12],
          image: 'https://placehold.co/300x200/10b981/ffffff?text=Animal+Facts',
          unlocked: false
        },
        {
          id: 'coding-blocks',
          name: 'Coding Blocks',
          description: 'Introduction to coding concepts through block programming',
          category: 'logic',
          difficulty: 'moderate',
          ageRange: [8, 14],
          image: 'https://placehold.co/300x200/6366f1/ffffff?text=Coding+Blocks',
          unlocked: false
        },
        {
          id: 'paint-studio',
          name: 'Paint Studio',
          description: 'Digital art creation with various tools',
          category: 'arts',
          difficulty: 'easy',
          ageRange: [5, 12],
          image: 'https://placehold.co/300x200/ec4899/ffffff?text=Paint+Studio',
          unlocked: false
        }
      ];
      
      setGames(generatedGames);
      
      // Load unlocked games from localStorage
      try {
        const storedGames = localStorage.getItem('unlockedGames');
        if (storedGames) {
          const parsedGames = JSON.parse(storedGames);
          // Find the full game objects from the generated games
          const fullUnlockedGames = generatedGames.filter(game => 
            parsedGames.includes(game.id)
          ).map(game => ({...game, unlocked: true}));
          
          setUnlockedGames(fullUnlockedGames);
          
          // If no games were found in localStorage, initialize with starter games
          if (fullUnlockedGames.length === 0) {
            initializeStarterGames(generatedGames);
          }
        } else {
          // For first-time users, unlock multiple games by default for better experience
          initializeStarterGames(generatedGames);
        }
      } catch (error) {
        console.error('Error loading unlocked games', error);
        // Default to first game if there's an error
        const starterGame = {...generatedGames[0], unlocked: true};
        setUnlockedGames([starterGame]);
        localStorage.setItem('unlockedGames', JSON.stringify([starterGame.id]));
      }
      
      // Helper function to initialize starter games
      function initializeStarterGames(games) {
        const starterGames = [
          {...games[0], unlocked: true},
          {...games[1], unlocked: true},
          {...games[3], unlocked: true}
        ];
        setUnlockedGames(starterGames);
        localStorage.setItem('unlockedGames', JSON.stringify(starterGames.map(game => game.id)));
        console.log('Initialized starter games:', starterGames);
      }
      
      // Load spins left from localStorage
      try {
        const storedSpins = localStorage.getItem('spinsLeft');
        if (storedSpins !== null) {
          setSpinsLeft(parseInt(storedSpins));
        } else {
          // Default for new users
          setSpinsLeft(3);
          localStorage.setItem('spinsLeft', '3');
        }
      } catch (error) {
        console.error('Error loading spins left', error);
      }
    };
    
    initializeGames();
  }, []);
  
  // Update localStorage when unlocked games change
  useEffect(() => {
    if (unlockedGames.length > 0) {
      const gameIds = unlockedGames.map(game => game.id);
      localStorage.setItem('unlockedGames', JSON.stringify(gameIds));
      console.log('Updated unlocked games in localStorage:', gameIds);
    } else {
      // If no unlocked games, check if we have survey data to recommend games
      try {
        const storedData = localStorage.getItem('surveyData');
        if (storedData) {
          const surveyData = JSON.parse(storedData);
          console.log('Found survey data, updating game recommendations:', surveyData);
          // Use the survey data to update game recommendations
          updateGamesFromSurvey(surveyData);
        }
      } catch (error) {
        console.error('Error checking survey data for game recommendations:', error);
      }
    }
  }, [unlockedGames]);
  
  // Update localStorage when spins left changes
  useEffect(() => {
    localStorage.setItem('spinsLeft', spinsLeft.toString());
  }, [spinsLeft]);
  
  const spinWheel = () => {
    // Check if user has spins left
    if (spinsLeft <= 0) {
      return {
        success: false,
        message: 'No spins left today!'
      };
    }
    
    // Get games that are not yet unlocked
    const lockedGames = games.filter(game => 
      !unlockedGames.some(unlocked => unlocked.id === game.id)
    );
    
    // If all games are unlocked, return message
    if (lockedGames.length === 0) {
      return {
        success: false,
        message: 'All games are already unlocked!'
      };
    }
    
    // Randomly select a game to unlock
    const randomIndex = Math.floor(Math.random() * lockedGames.length);
    const gameToUnlock = lockedGames[randomIndex];
    
    // Mark the game as unlocked
    const updatedGame = { ...gameToUnlock, unlocked: true };
    
    // Update state
    setUnlockedGames([...unlockedGames, updatedGame]);
    setSpinsLeft(prevSpins => prevSpins - 1);
    setCurrentSpin(updatedGame);
    
    return {
      success: true,
      game: updatedGame
    };
  };
  
  const updateGamesFromSurvey = async (surveyData) => {
    // This function uses AI to analyze survey responses and update game recommendations
    
    if (!surveyData) return;
    
    try {
      console.log('Initializing AI model for game recommendations...');
      
      // Initialize the AI model if not already initialized
      if (!gameRecommender.initialized) {
        await gameRecommender.initialize();
        // No need for training in our simplified AI approach
        await gameRecommender.trainWithSampleData(); // For compatibility
      }
      
      console.log('Getting AI-based recommendations for user:', surveyData);
      
      // Get recommendations from the AI model
      const recommendations = await gameRecommender.getRecommendations(surveyData);
      
      if (recommendations && recommendations.length > 0) {
        // Map recommendation scores to games
        const scoredGames = games.map(game => {
          // Find the corresponding recommendation score for this game
          const gameIndex = games.findIndex(g => g.id === game.id);
          const recommendation = recommendations.find(r => r.gameId === gameIndex);
          
          return {
            ...game,
            relevanceScore: recommendation ? recommendation.score * 100 : 0
          };
        });
        
        console.log('AI model recommendations:', scoredGames.map(g => ({ id: g.id, name: g.name, score: g.relevanceScore })));
        
        // Sort games by relevance score
        const sortedGames = [...scoredGames].sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // Unlock the top 3 recommended games based on AI predictions
        const topGames = sortedGames.slice(0, 3).map(game => ({ ...game, unlocked: true }));
        setUnlockedGames(topGames);
        
        // Generate explanations for why these games were recommended
        const explanations = gameRecommender.explainRecommendations(surveyData, topGames);
        console.log('AI recommendation explanations:', explanations);
        
        // Save the unlocked game IDs to localStorage
        localStorage.setItem('unlockedGames', JSON.stringify(topGames.map(game => game.id)));
        
        // Update the game order based on AI relevance
        setGames(sortedGames);
      } else {
        // Fallback to traditional scoring if AI recommendations fail
        console.warn('AI recommendations failed, falling back to traditional scoring');
        fallbackTraditionalScoring(surveyData);
      }
    } catch (error) {
      console.error('Error using AI for game recommendations:', error);
      // Fallback to traditional scoring method
      fallbackTraditionalScoring(surveyData);
    }
    
    // For demo purposes, provide 3 spins to try out the system
    setSpinsLeft(3);
  };
  
  // Traditional scoring method as fallback
  const fallbackTraditionalScoring = (surveyData) => {
    const { learningGoals, interests, ageGroup, learningStyle } = surveyData;
    
    // Create a scoring system for games based on survey data
    const scoredGames = games.map(game => {
      let score = 0;
      
      // Score based on category matching learning goals
      if (learningGoals && learningGoals.includes(game.category)) {
        score += 10;
      }
      
      // Score based on interests (if game category relates to interests)
      if (interests && interests.some(interest => {
        // Map interests to potential game categories
        const interestToCategory = {
          'animals': 'science',
          'space': 'science',
          'music': 'arts',
          'sports': 'motor',
          'cooking': 'arts',
          'nature': 'science',
          'history': 'language',
          'technology': 'logic',
          'dinosaurs': 'science',
          'superheroes': 'arts',
          'fantasy': 'language',
          'vehicles': 'motor'
        };
        return interestToCategory[interest] === game.category;
      })) {
        score += 8;
      }
      
      // Score based on age appropriateness
      const [minAge, maxAge] = game.ageRange;
      let userAgeRange = [0, 100]; // Default range
      
      if (ageGroup) {
        // Handle non-hyphenated age groups like "17+"
        if (ageGroup.includes('+')) {
          const minAgeUser = parseInt(ageGroup.replace('+', ''));
          userAgeRange = [minAgeUser, 100];
        } else if (ageGroup.includes('-')) {
          userAgeRange = ageGroup.split('-').map(Number);
        }
      }
      
      if (minAge <= userAgeRange[1] && maxAge >= userAgeRange[0]) {
        score += 5;
        // Even better if it's right in the middle of their range
        if (minAge >= userAgeRange[0] && maxAge <= userAgeRange[1]) {
          score += 3;
        }
      } else {
        // Age mismatch, penalize heavily
        score -= 10;
      }
      
      return {
        ...game,
        relevanceScore: score
      };
    });
    
    // Sort games by relevance score
    const sortedGames = [...scoredGames].sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Unlock the top 3 recommended games based on survey data
    const topGames = sortedGames.slice(0, 3).map(game => ({ ...game, unlocked: true }));
    setUnlockedGames(topGames);
    
    // Save the unlocked game IDs to localStorage
    localStorage.setItem('unlockedGames', JSON.stringify(topGames.map(game => game.id)));
    
    // Update the game order based on relevance
    setGames(sortedGames);
  };
  
  const value = {
    games,
    unlockedGames,
    spinsLeft,
    currentSpin,
    spinWheel,
    updateGamesFromSurvey
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};