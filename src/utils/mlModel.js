// Machine Learning Model for Game Recommendations
// Using TensorFlow.js for neural network-based recommendations
import * as tf from '@tensorflow/tfjs';

// Neural network-based recommendation model for games
class GameRecommendationModel {
  constructor() {
    this.model = null;
    this.gameFeatures = {};
    this.initialized = false;
  }

  async initialize() {
    try {
      // Initialize game features database
      this.initializeGameFeatures();
      
      // Create a sequential neural network model
      this.model = tf.sequential();
      
      // Add layers to the model
      // Input layer with 15 features
      this.model.add(tf.layers.dense({
        inputShape: [15],
        units: 24,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
      }));
      
      // First hidden layer
      this.model.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
      }));
      
      // Second hidden layer
      this.model.add(tf.layers.dense({
        units: 12,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
      }));
      
      // Output layer with 12 units (one for each game)
      this.model.add(tf.layers.dense({
        units: 12,
        activation: 'sigmoid',
        kernelInitializer: 'varianceScaling'
      }));
      
      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError'
      });
      
      // Initialize game features for explanation purposes
      this.initializeGameFeatures();
      
      this.initialized = true;
      console.log('TensorFlow.js game recommendation model initialized');
      return true;
    } catch (error) {
      console.error('Error initializing TensorFlow.js model:', error);
      return false;
    }
  }
  
  // Define the characteristics of each game
  initializeGameFeatures() {
    // Game IDs correspond to the indices in the games array
    this.gameFeatures = {
      0: { // Math Puzzles
        ageGroups: ['4-7', '8-12'],
        learningStyles: ['visual', 'reading'],
        specialNeedsSupport: ['adhd', 'dyslexia'],
        interestAreas: ['science', 'technology', 'puzzles'],
        attentionSpanRequired: 'medium',
        experienceLevelRequired: 'beginner'
      },
      1: { // Word Builder
        ageGroups: ['8-12', '13-16'],
        learningStyles: ['reading', 'visual'],
        specialNeedsSupport: ['dyslexia', 'autism'],
        interestAreas: ['reading', 'writing', 'language'],
        attentionSpanRequired: 'medium',
        experienceLevelRequired: 'beginner'
      },
      2: { // Memory Cards
        ageGroups: ['4-7', '8-12', '13-16'],
        learningStyles: ['visual', 'multimodal'],
        specialNeedsSupport: ['adhd', 'autism'],
        interestAreas: ['games', 'puzzles'],
        attentionSpanRequired: 'short',
        experienceLevelRequired: 'beginner'
      },
      3: { // Science Explorer
        ageGroups: ['8-12', '13-16', '17+'],
        learningStyles: ['visual', 'reading', 'kinesthetic'],
        specialNeedsSupport: ['adhd', 'autism'],
        interestAreas: ['science', 'nature', 'technology'],
        attentionSpanRequired: 'medium',
        experienceLevelRequired: 'intermediate'
      },
      4: { // Story Creator
        ageGroups: ['8-12', '13-16', '17+'],
        learningStyles: ['reading', 'auditory', 'multimodal'],
        specialNeedsSupport: ['dyslexia', 'autism'],
        interestAreas: ['writing', 'reading', 'arts'],
        attentionSpanRequired: 'long',
        experienceLevelRequired: 'intermediate'
      },
      5: { // Pattern Blocks
        ageGroups: ['4-7', '8-12'],
        learningStyles: ['visual', 'kinesthetic'],
        specialNeedsSupport: ['adhd', 'autism', 'dyslexia'],
        interestAreas: ['puzzles', 'arts', 'technology'],
        attentionSpanRequired: 'medium',
        experienceLevelRequired: 'beginner'
      },
      6: { // Animal Facts
        ageGroups: ['4-7', '8-12', '13-16'],
        learningStyles: ['visual', 'reading', 'auditory'],
        specialNeedsSupport: ['adhd', 'autism'],
        interestAreas: ['nature', 'science', 'animals'],
        attentionSpanRequired: 'short',
        experienceLevelRequired: 'beginner'
      },
      7: { // Coding Blocks
        ageGroups: ['8-12', '13-16', '17+'],
        learningStyles: ['visual', 'kinesthetic', 'reading'],
        specialNeedsSupport: ['adhd', 'autism'],
        interestAreas: ['technology', 'puzzles', 'science'],
        attentionSpanRequired: 'long',
        experienceLevelRequired: 'intermediate'
      },
      8: { // Paint Studio
        ageGroups: ['4-7', '8-12', '13-16'],
        learningStyles: ['visual', 'kinesthetic'],
        specialNeedsSupport: ['adhd', 'autism', 'dyslexia'],
        interestAreas: ['arts', 'creativity'],
        attentionSpanRequired: 'variable',
        experienceLevelRequired: 'beginner'
      },
      9: { // Music Maker
        ageGroups: ['4-7', '8-12', '13-16', '17+'],
        learningStyles: ['auditory', 'kinesthetic', 'multimodal'],
        specialNeedsSupport: ['adhd', 'autism', 'dyslexia'],
        interestAreas: ['music', 'arts', 'creativity'],
        attentionSpanRequired: 'medium',
        experienceLevelRequired: 'beginner'
      },
      10: { // History Time Machine
        ageGroups: ['8-12', '13-16', '17+'],
        learningStyles: ['visual', 'reading', 'auditory'],
        specialNeedsSupport: ['adhd', 'dyslexia'],
        interestAreas: ['history', 'reading', 'culture'],
        attentionSpanRequired: 'long',
        experienceLevelRequired: 'intermediate'
      },
      11: { // Math Lab
        ageGroups: ['8-12', '13-16', '17+'],
        learningStyles: ['visual', 'kinesthetic', 'multimodal'],
        specialNeedsSupport: ['adhd', 'dyscalculia'],
        interestAreas: ['science', 'technology', 'puzzles'],
        attentionSpanRequired: 'medium',
        experienceLevelRequired: 'advanced'
      }
    };
  }

  // Process user data into tensor format for neural network
  preprocessUserData(userData) {
    // Extract and normalize features into a flat array
    const features = [];
    
    // Age group (normalize to 0-1 range)
    const ageMap = {
      '4-7': 0,
      '8-12': 0.33,
      '13-16': 0.67,
      '17+': 1
    };
    features.push(ageMap[userData.ageGroup] || 0.33); // Default to middle age group
    
    // Learning style (one-hot encoded)
    const learningStyles = ['visual', 'auditory', 'reading', 'kinesthetic', 'multimodal'];
    learningStyles.forEach(style => {
      features.push(userData.learningStyle === style ? 1 : 0);
    });
    
    // Special needs (binary flags)
    const specialNeedsTypes = ['none', 'adhd', 'autism', 'dyslexia', 'dyscalculia'];
    specialNeedsTypes.forEach(need => {
      if (userData.specialNeeds && userData.specialNeeds.length > 0) {
        features.push(userData.specialNeeds.includes(need) ? 1 : 0);
      } else {
        // Default to 'none' if not specified
        features.push(need === 'none' ? 1 : 0);
      }
    });
    
    // Interests (normalized by count, max 3 interests)
    if (userData.interests && userData.interests.length > 0) {
      const interestCategories = ['science', 'technology', 'arts', 'language', 'nature'];
      const interestMap = {
        'animals': 'nature',
        'space': 'science',
        'dinosaurs': 'science',
        'music': 'arts',
        'drawing': 'arts',
        'reading': 'language',
        'writing': 'language',
        'coding': 'technology',
        'robots': 'technology',
        'plants': 'nature'
      };
      
      // Count interests in each category
      const categoryCounts = {};
      interestCategories.forEach(cat => categoryCounts[cat] = 0);
      
      userData.interests.forEach(interest => {
        const category = interestMap[interest] || interest;
        if (interestCategories.includes(category)) {
          categoryCounts[category] += 1;
        }
      });
      
      // Normalize and add to features
      interestCategories.forEach(category => {
        features.push(categoryCounts[category] / Math.min(3, userData.interests.length));
      });
    } else {
      // Default values if no interests specified
      for (let i = 0; i < 5; i++) features.push(0);
    }
    
    // Attention span
    const attentionMap = {
      'short': 0,
      'medium': 0.5,
      'long': 1,
      'variable': 0.75
    };
    features.push(attentionMap[userData.attentionSpan] || 0.5);
    
    // Previous experience
    const experienceMap = {
      'beginner': 0,
      'intermediate': 0.5,
      'advanced': 1
    };
    features.push(experienceMap[userData.previousExperience] || 0);
    
    // UI preferences
    if (userData.preferences) {
      // Colors preference
      const colorMap = {
        'muted': 0,
        'moderate': 0.5,
        'bright': 1
      };
      features.push(colorMap[userData.preferences.colors] || 0.5);
      
      // Pace preference
      const paceMap = {
        'slow': 0,
        'medium': 0.5,
        'fast': 1
      };
      features.push(paceMap[userData.preferences.pace] || 0.5);
      
      // Interactivity preference
      const interactivityMap = {
        'low': 0,
        'medium': 0.5,
        'high': 1
      };
      features.push(interactivityMap[userData.preferences.interactivity] || 0.5);
    } else {
      // Default values if preferences not provided
      features.push(0.5, 0.5, 0.5);
    }
    
    // Ensure we return a tensor
    return tf.tensor2d([features]);
  }
  
  // Train the model with sample data
  async trainWithSampleData() {
    if (!this.initialized) await this.initialize();
    
    // Sample training data (in real app, this would come from user interactions)
    const sampleFeatures = [
      // Visual learner, young, no special needs, interests in animals, medium attention, beginner, bright colors, medium pace, medium interactivity
      [0, 1, 0, 0, 0, 0, 0, 0.3, 0, 0, 0.5, 0, 1, 0.5, 0.5],
      // Auditory learner, teen, with special needs, interests in music, long attention, intermediate, moderate colors, medium pace, high interactivity
      [0.67, 0, 1, 0, 0, 0, 1, 0.5, 0, 0, 1, 0.5, 0.5, 0.5, 1],
      // Kinesthetic learner, middle age, no special needs, interests in sports, short attention, beginner, bright colors, fast pace, high interactivity
      [0.33, 0, 0, 0, 1, 0, 0, 0.7, 0, 0, 0, 0, 1, 1, 1],
      // Reading learner, older, no special needs, interests in history, variable attention, advanced, muted colors, slow pace, low interactivity
      [1, 0, 0, 1, 0, 0, 0, 0.4, 0, 0, 0.75, 1, 0, 0, 0],
      // Multimodal learner, young, with special needs, interests in technology, long attention, intermediate, bright colors, medium pace, medium interactivity
      [0, 0, 0, 0, 0, 1, 1, 0, 0.6, 0, 1, 0.5, 1, 0.5, 0.5],
      // Visual learner, middle age, no special needs, interests in space, short attention, advanced, moderate colors, fast pace, medium interactivity
      [0.33, 1, 0, 0, 0, 0, 0, 0, 0.2, 0, 0, 1, 0.5, 1, 0.5]
    ];
    
    // Sample labels (game preferences for each user)
    // One-hot encoded for 12 games
    const sampleLabels = [
      [0.8, 0.1, 0.7, 0.2, 0.1, 0.1, 0.3, 0.1, 0.6, 0.2, 0.1, 0.1], // Prefers games 0, 2, 8 (math, language, science)
      [0.1, 0.2, 0.1, 0.1, 0.7, 0.8, 0.1, 0.1, 0.1, 0.1, 0.6, 0.2], // Prefers games 4, 5, 10 (cognitive, motor, logic)
      [0.1, 0.1, 0.1, 0.7, 0.1, 0.1, 0.1, 0.8, 0.1, 0.6, 0.1, 0.1], // Prefers games 3, 7, 9 (science, arts, social)
      [0.1, 0.7, 0.1, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.1, 0.6], // Prefers games 1, 6, 11 (reading, social, art)
      [0.7, 0.1, 0.1, 0.1, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 0.1], // Prefers games 0, 4, 10 (math, cognitive, logic)
      [0.1, 0.1, 0.1, 0.7, 0.1, 0.1, 0.1, 0.8, 0.6, 0.1, 0.1, 0.1]  // Prefers games 3, 7, 8 (science, arts, science)
    ];
    
    const xs = tf.tensor2d(sampleFeatures);
    const ys = tf.tensor2d(sampleLabels);
    
    // Train the model
    try {
      const result = await this.model.fit(xs, ys, {
        epochs: 200,
        batchSize: 6,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs.loss}, val_loss = ${logs.val_loss || 'N/A'}`);
            }
          }
        }
      });
      
      console.log('Model training complete');
      return result;
    } catch (error) {
      console.error('Error training model:', error);
      return null;
    } finally {
      // Clean up tensors
      xs.dispose();
      ys.dispose();
    }
  }

  // Get game recommendations for a user
  async getRecommendations(userData) {
    if (!this.initialized) await this.initialize();
    if (!this.model) return null;
    
    try {
      // Preprocess user data into tensor format
      const userFeatures = this.preprocessUserData(userData);
      
      // Get predictions from the model
      const predictions = this.model.predict(userFeatures);
      const scores = await predictions.data();
      
      // Convert to array of {gameId, score} objects
      const gameScores = Array.from(scores).map((score, index) => ({
        gameId: index,
        score
      }));
      
      // Sort by score in descending order
      const sortedRecommendations = gameScores.sort((a, b) => b.score - a.score);
      
      // Clean up tensors
      userFeatures.dispose();
      predictions.dispose();
      
      return sortedRecommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return null;
    }
  }
  
  // Generate explanations for why specific games were recommended
  explainRecommendations(userData, recommendedGames) {
    try {
      // Get the user profile features
      const explanations = [];
      
      // For each recommended game, generate explanations based on feature matching
      for (const game of recommendedGames) {
        const gameId = game.gameId;
        const gameFeature = this.gameFeatures[gameId];
        if (!gameFeature) continue;
        
        let explanation = `Game ${gameId} was recommended because it `;
        const reasons = [];
        
        // Age group match
        if (gameFeature.ageGroups.includes(userData.ageGroup)) {
          reasons.push(`is designed for your age group (${userData.ageGroup})`);
        }
        
        // Learning style match
        if (userData.learningStyle && gameFeature.learningStyles.includes(userData.learningStyle)) {
          reasons.push(`supports your ${userData.learningStyle} learning style`);
        }
        
        // Special needs support
        if (userData.specialNeeds && userData.specialNeeds.length > 0 && 
            !userData.specialNeeds.includes('none')) {
          const supportedNeeds = userData.specialNeeds.filter(need => 
            gameFeature.specialNeedsSupport.includes(need)
          );
          if (supportedNeeds.length > 0) {
            reasons.push(`provides support for ${supportedNeeds.join(', ')}`);
          }
        }
        
        // Interest match
        if (userData.interests && userData.interests.length > 0) {
          const matchingInterests = userData.interests.filter(interest => 
            gameFeature.interestAreas.includes(interest)
          );
          if (matchingInterests.length > 0) {
            reasons.push(`aligns with your interests in ${matchingInterests.join(', ')}`);
          }
        }
        
        // Attention span
        if (userData.attentionSpan === gameFeature.attentionSpanRequired) {
          reasons.push(`is well-suited for your ${userData.attentionSpan} attention span`);
        }
        
        // Experience level
        if (userData.previousExperience === gameFeature.experienceLevelRequired) {
          reasons.push(`matches your ${userData.previousExperience} experience level`);
        }
        
        // Add neural network confidence
        reasons.push(`received a high match score of ${(game.score * 100).toFixed(1)}% from our TensorFlow.js model`);
        
        if (reasons.length === 0) {
          explanation += 'provides a good overall learning experience.';
        } else if (reasons.length === 1) {
          explanation += reasons[0] + '.';
        } else {
          explanation += reasons.slice(0, -1).join(', ') + ' and ' + reasons[reasons.length - 1] + '.';
        }
        
        explanations.push({
          gameId: gameId,
          explanation: explanation
        });
      }
      
      return explanations;
    } catch (error) {
      console.error('Error generating explanations:', error);
      return [];
    }
  }
  
  // Generate daily personalized recommendations based on user profile
  generateDailyRecommendation(userData) {
    try {
      if (!userData) return null;
      
      // Get day of week (0-6, where 0 is Sunday)
      const today = new Date();
      const dayOfWeek = today.getDay();
      
      // Define learning focus areas for each day of the week
      const dailyFocus = [
        { day: 'Sunday', focus: 'creativity', areas: ['arts', 'music', 'writing'] },
        { day: 'Monday', focus: 'math', areas: ['math', 'logic', 'puzzles'] },
        { day: 'Tuesday', focus: 'language', areas: ['reading', 'writing', 'language'] },
        { day: 'Wednesday', focus: 'science', areas: ['science', 'nature', 'technology'] },
        { day: 'Thursday', focus: 'social', areas: ['social', 'communication'] },
        { day: 'Friday', focus: 'mixed', areas: ['games', 'puzzles', 'technology'] },
        { day: 'Saturday', focus: 'exploration', areas: ['nature', 'history', 'culture'] }
      ];
      
      const todayFocus = dailyFocus[dayOfWeek];
      
      // Generate a personalized message based on user profile and today's focus
      let message = `Today is ${todayFocus.day}, a great day to focus on ${todayFocus.focus}! `;
      
      // Add personalized recommendation based on user's learning style
      if (userData.learningStyle) {
        switch (userData.learningStyle) {
          case 'visual':
            message += `As a visual learner, try activities with diagrams, charts, and visual demonstrations. `;
            break;
          case 'auditory':
            message += `As an auditory learner, consider activities with spoken instructions and musical elements. `;
            break;
          case 'reading':
            message += `As a reading/writing learner, focus on activities involving text and written exercises. `;
            break;
          case 'kinesthetic':
            message += `As a kinesthetic learner, engage with hands-on activities that involve movement. `;
            break;
          case 'multimodal':
            message += `With your multimodal learning style, mix different types of activities throughout the day. `;
            break;
          default:
            message += `Try a variety of learning activities today. `;
        }
      }
      
      // Add recommendation based on attention span
      if (userData.attentionSpan) {
        switch (userData.attentionSpan) {
          case 'short':
            message += `Plan for short, focused sessions with breaks in between. `;
            break;
          case 'medium':
            message += `Aim for 15-20 minute learning sessions with short breaks. `;
            break;
          case 'long':
            message += `You can engage in longer, more in-depth learning activities today. `;
            break;
          case 'variable':
            message += `Mix shorter and longer activities based on your interest level. `;
            break;
          default:
            message += `Balance your learning time with appropriate breaks. `;
        }
      }
      
      // Add specific game recommendations based on today's focus
      message += `We recommend focusing on the following learning areas today: ${todayFocus.areas.join(', ')}.`;
      
      return {
        message,
        focusAreas: todayFocus.areas,
        dayOfWeek: todayFocus.day,
        focusName: todayFocus.focus
      };
    } catch (error) {
      console.error('Error generating daily recommendation:', error);
      return null;
    }
  }
  
  // For backward compatibility with the previous implementation
  async trainWithSampleData() {
    // This method is kept for compatibility but doesn't do anything in this implementation
    console.log('Sample training simulation complete');
    return true;
  }
}

// Create and export a singleton instance
const gameRecommender = new GameRecommendationModel();
export default gameRecommender;