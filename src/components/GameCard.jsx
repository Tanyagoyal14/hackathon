import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Notification from './Notification';

const GameCard = ({ game }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [wordAnswer, setWordAnswer] = useState('');
  const timerRef = useRef(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: '',
    message: ''
  });
  
  // Timer effect for countdown
  useEffect(() => {
    if (isPlaying && gameState) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set up a new timer
      timerRef.current = setInterval(() => {
        setGameState(prevState => {
          // If time is up, end the game
          if (prevState.timeLeft <= 1) {
            clearInterval(timerRef.current);
            return {
              ...prevState,
              timeLeft: 0
            };
          }
          
          // Otherwise, decrement the timer
          return {
            ...prevState,
            timeLeft: prevState.timeLeft - 1
          };
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, gameState?.level]); // Re-run when level changes or game starts/stops
  
  // Default placeholder image if game image is not found
  const fallbackImage = "https://via.placeholder.com/300x200/6366f1/ffffff?text=Game";
  
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };
  
  // Handle math game answer
  const handleMathAnswer = (selectedAnswer) => {
    // Parse the question to get the correct answer
    const questionParts = gameState.question.split(' ');
    const a = parseInt(questionParts[0]);
    const b = parseInt(questionParts[2]);
    const correctAnswer = a + b;
    
    if (selectedAnswer === correctAnswer) {
      // Correct answer
      const newScore = gameState.score + 10;
      const newLevel = Math.floor(newScore / 30) + 1;
      
      // Generate new question first
      const newQuestion = generateMathQuestion(newLevel);
      const newOptions = generateMathOptions(newLevel, newQuestion);
      
      setGameState({
        ...gameState,
        score: newScore,
        level: newLevel,
        question: newQuestion,
        options: newOptions,
        timeLeft: 30
      });
      
      // Show success notification
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Correct! +10 points'
      });
    } else {
      // Wrong answer
      // Generate new question first
      const newQuestion = generateMathQuestion(gameState.level);
      const newOptions = generateMathOptions(gameState.level, newQuestion);
      
      setGameState({
        ...gameState,
        score: Math.max(0, gameState.score - 5),
        question: newQuestion,
        options: newOptions,
        timeLeft: 30
      });
      
      // Show error notification
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Wrong answer! -5 points'
      });
    }
  };
  
  // Handle word game answer
  const checkWordAnswer = () => {
    if (wordAnswer.toLowerCase() === gameState.word.toLowerCase()) {
      // Correct answer
      const newScore = gameState.score + 10;
      const newLevel = Math.floor(newScore / 30) + 1;
      const newWord = getRandomWord(newLevel);
      
      setGameState({
        ...gameState,
        score: newScore,
        level: newLevel,
        word: newWord,
        scrambled: scrambleWord(newWord),
        timeLeft: 30
      });
      
      setWordAnswer('');
      
      // Show success notification
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Correct! +10 points'
      });
    } else {
      // Wrong answer
      setGameState({
        ...gameState,
        score: Math.max(0, gameState.score - 5),
        timeLeft: 30
      });
      
      // Show error notification
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Wrong answer! -5 points'
      });
    }
  };
  
  // Handle quiz answers for science category
  const handleQuizAnswer = (selectedAnswer) => {
    if (selectedAnswer === gameState.correctAnswer) {
      // Correct answer
      const newScore = gameState.score + 10;
      const newLevel = Math.floor(newScore / 30) + 1;
      
      // Get new question
      const newQuestion = getRandomScienceQuestion(newLevel);
      
      setGameState({
        ...gameState,
        score: newScore,
        level: newLevel,
        question: newQuestion.question,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        timeLeft: 30
      });
      
      // Show success notification
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Correct! +10 points'
      });
    } else {
      // Wrong answer
      const newQuestion = getRandomScienceQuestion(gameState.level);
      
      setGameState({
        ...gameState,
        score: Math.max(0, gameState.score - 5),
        question: newQuestion.question,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        timeLeft: 30
      });
      
      // Show error notification
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Wrong answer! -5 points'
      });
    }
  };
  
  // Handle memory card clicks for cognitive category
  const handleCardClick = (index) => {
    // Don't allow clicking if two cards are already flipped and not matched
    const flippedCards = gameState.cards.filter(card => card.flipped && !card.matched);
    if (flippedCards.length >= 2) return;
    
    // Don't allow clicking on already matched or flipped cards
    if (gameState.cards[index].matched || gameState.cards[index].flipped) return;
    
    // Flip the card
    const newCards = [...gameState.cards];
    newCards[index].flipped = true;
    
    // Check if we have two flipped cards
    const newFlippedCards = newCards.filter(card => card.flipped && !card.matched);
    if (newFlippedCards.length === 2) {
      // Check if they match
      if (newFlippedCards[0].value === newFlippedCards[1].value) {
        // Mark as matched
        newCards.forEach(card => {
          if (card.flipped && !card.matched) {
            card.matched = true;
          }
        });
        
        // Update score
        const newScore = gameState.score + 10;
        const newLevel = Math.floor(newScore / 30) + 1;
        
        // Show success notification
        setNotification({
          isVisible: true,
          type: 'success',
          message: 'Match found! +10 points'
        });
        
        // Check if all pairs are matched
        const allMatched = newCards.every(card => card.matched);
        if (allMatched) {
          // Generate new set of cards for next level
          setGameState({
            ...gameState,
            score: newScore,
            level: newLevel,
            cards: generateMemoryCards(newLevel),
            timeLeft: 30
          });
        } else {
          // Continue with current set
          setGameState({
            ...gameState,
            score: newScore,
            cards: newCards,
            timeLeft: gameState.timeLeft
          });
        }
      } else {
        // No match, flip back after a delay
        setGameState({
          ...gameState,
          cards: newCards
        });
        
        // Show error notification
        setNotification({
          isVisible: true,
          type: 'error',
          message: 'No match! -2 points'
        });
        
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards.forEach(card => {
            if (!card.matched) {
              card.flipped = false;
            }
          });
          
          setGameState(prevState => ({
            ...prevState,
            cards: resetCards,
            score: Math.max(0, prevState.score - 2)
          }));
        }, 1000);
      }
    } else {
      // Just update the cards state
      setGameState({
        ...gameState,
        cards: newCards
      });
    }
  };
  
  // Handle generic game answers
  const handleGenericAnswer = (isCorrect) => {
    if (isCorrect) {
      // Correct answer
      const newScore = gameState.score + 10;
      const newLevel = Math.floor(newScore / 30) + 1;
      
      setGameState({
        ...gameState,
        score: newScore,
        level: newLevel,
        correctIndex: Math.floor(Math.random() * 4),
        timeLeft: 30
      });
      
      // Show success notification
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Correct! +10 points'
      });
    } else {
      // Wrong answer
      setGameState({
        ...gameState,
        score: Math.max(0, gameState.score - 5),
        correctIndex: Math.floor(Math.random() * 4),
        timeLeft: 30
      });
      
      // Show error notification
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Wrong answer! -5 points'
      });
    }
  };
  
  // Generate memory cards for cognitive games
  const generateMemoryCards = (level) => {
    const pairCount = Math.min(6, level + 2); // Increase pairs with level, max 6 pairs (12 cards)
    const values = [];
    
    // Generate pairs based on level
    for (let i = 1; i <= pairCount; i++) {
      values.push(i);
      values.push(i);
    }
    
    // Shuffle the values
    const shuffled = values.sort(() => Math.random() - 0.5);
    
    // Create card objects
    return shuffled.map(value => ({
      value,
      flipped: false,
      matched: false
    }));
  };
  
  // Generate science questions
  const getRandomScienceQuestion = (level) => {
    const questions = [
      {
        question: "What is the closest planet to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctAnswer: "Mercury"
      },
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctAnswer: "H2O"
      },
      {
        question: "Which animal can fly?",
        options: ["Bird", "Fish", "Snake", "Frog"],
        correctAnswer: "Bird"
      },
      {
        question: "What do plants need to make their food?",
        options: ["Sunlight", "Meat", "Chocolate", "Milk"],
        correctAnswer: "Sunlight"
      },
      {
        question: "How many legs does a spider have?",
        options: ["8", "6", "4", "10"],
        correctAnswer: "8"
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Earth", "Neptune"],
        correctAnswer: "Jupiter"
      }
    ];
    
    // For higher levels, add more difficult questions
    if (level >= 2) {
      questions.push(
        {
          question: "What is the hardest natural substance on Earth?",
          options: ["Diamond", "Gold", "Iron", "Granite"],
          correctAnswer: "Diamond"
        },
        {
          question: "Which gas do plants release during photosynthesis?",
          options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
          correctAnswer: "Oxygen"
        }
      );
    }
    
    // Return a random question
    return questions[Math.floor(Math.random() * questions.length)];
  };
  
  const startGame = (game) => {
    setIsPlaying(true);
    
    // Initialize game state based on game type
    let initialState;
    
    switch(game.category.toLowerCase()) {
      case 'math':
        const mathQuestion = generateMathQuestion(1);
        initialState = {
          score: 0,
          level: 1,
          question: mathQuestion,
          options: generateMathOptions(1, mathQuestion),
          timeLeft: 30
        };
        break;
      case 'language':
        const word = getRandomWord(1);
        initialState = {
          score: 0,
          level: 1,
          word: word,
          scrambled: scrambleWord(word),
          timeLeft: 30
        };
        break;
      case 'science':
        const scienceQuestion = getRandomScienceQuestion(1);
        initialState = {
          score: 0,
          level: 1,
          question: scienceQuestion.question,
          options: scienceQuestion.options,
          correctAnswer: scienceQuestion.correctAnswer,
          timeLeft: 30
        };
        break;
      case 'cognitive':
        initialState = {
          score: 0,
          level: 1,
          cards: generateMemoryCards(1),
          timeLeft: 30
        };
        break;
      default:
        initialState = {
          score: 0,
          level: 1,
          correctIndex: Math.floor(Math.random() * 4), // Random correct answer for generic games
          timeLeft: 30
        };
    }
    
    setGameState(initialState);
  };
  
  // Helper functions for game initialization
  const generateMathQuestion = (level) => {
    const max = level * 10;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    return `${a} + ${b} = ?`;
  };
  
  const generateMathOptions = (level, question) => {
    // Extract numbers from the provided question to ensure options match the actual question
    const questionParts = question ? question.split(' ') : generateMathQuestion(level).split(' ');
    const a = parseInt(questionParts[0]);
    const b = parseInt(questionParts[2]);
    const correctAnswer = a + b;
    
    // Generate 3 wrong options that are close to the correct answer
    const options = [correctAnswer];
    while (options.length < 4) {
      // Generate wrong answers that are within a reasonable range
      // Some slightly higher, some slightly lower than the correct answer
      const offset = Math.floor(Math.random() * 5) + 1;
      const wrongAnswer = Math.random() > 0.5 ? correctAnswer + offset : correctAnswer - offset;
      
      // Ensure no negative numbers and no duplicates
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };
  
  const getRandomWord = (level) => {
    const words = [
      'cat', 'dog', 'sun', 'run', 'hat',  // Level 1
      'apple', 'house', 'train', 'plant',   // Level 2
      'elephant', 'computer', 'mountain'     // Level 3
    ];
    
    const levelWords = words.filter(word => {
      if (level === 1 && word.length <= 3) return true;
      if (level === 2 && word.length > 3 && word.length <= 6) return true;
      if (level === 3 && word.length > 6) return true;
      return false;
    });
    
    return levelWords[Math.floor(Math.random() * levelWords.length)];
  };
  
  const scrambleWord = (word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };
  
  // Handle game exit
  const exitGame = () => {
    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset game state
    setIsPlaying(false);
    setGameState(null);
    setWordAnswer('');
  };

  // Close notification handler
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      isVisible: false
    });
  };
  
  // Render game interface when playing, otherwise show game card
  if (isPlaying && gameState) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden p-5 relative">
        <Notification 
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={handleCloseNotification}
        />
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{game.name}</h3>
          <button 
            onClick={exitGame}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md transition"
          >
            Exit Game
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Score: <span className="text-indigo-600 dark:text-indigo-400">{gameState.score}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Level: <span className="text-indigo-600 dark:text-indigo-400">{gameState.level}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time: <span className="text-indigo-600 dark:text-indigo-400">{gameState.timeLeft}s</span>
          </div>
        </div>
        
        {/* Game content based on category */}
        {game.category === 'math' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center">
              <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{gameState.question}</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMathAnswer(option)}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {game.category === 'language' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center">
              <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Unscramble the word:</h4>
              <p className="text-2xl font-bold mt-2 tracking-wider text-indigo-600 dark:text-indigo-400">{gameState.scrambled}</p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <input 
                type="text" 
                placeholder="Type your answer here"
                className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                onChange={(e) => setWordAnswer(e.target.value)}
              />
              <button
                onClick={checkWordAnswer}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}
        
        {/* Quiz game for science category */}
        {game.category.toLowerCase() === 'science' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center">
              <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{gameState.question}</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Memory game for cognitive category */}
        {game.category.toLowerCase() === 'cognitive' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center mb-4">
              <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Memory Game</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Match the pairs!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {gameState.cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`p-3 h-20 flex items-center justify-center text-lg font-bold rounded-lg transition ${card.flipped ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-white dark:bg-gray-700'}`}
                  disabled={card.matched || card.flipped}
                >
                  {card.flipped || card.matched ? card.value : '?'}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Default game interface for other categories */}
        {!['math', 'language', 'science', 'cognitive'].includes(game.category.toLowerCase()) && (
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center">
              <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Interactive Game</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400 mb-4">Click on the correct answer!</p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => {
                  // Determine if this is the correct option
                  const isCorrect = index === gameState.correctIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleGenericAnswer(isCorrect)}
                      className="p-3 border rounded-lg text-center transition bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Regular game card display
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
        <img 
          src={game.image || fallbackImage} 
          alt={game.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
            {game.category}
          </span>
          <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            {game.difficulty}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{game.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{game.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Ages {game.ageRange[0]}-{game.ageRange[1]}</span>
          </div>
          
          <button 
            onClick={() => startGame(game)} 
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition"
          >
            Play Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;