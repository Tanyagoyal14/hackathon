import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Box, Typography, Paper, Chip, LinearProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const TaskItem = styled(Box)(({ theme, completed }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: completed ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: completed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.9)',
  },
}));

const DailyRecommendation = () => {
  const { surveyData, unlockedGames } = useGame();
  const [dailyRecommendation, setDailyRecommendation] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Load saved progress from localStorage
  useEffect(() => {
    setLoading(true);
    const savedTasks = localStorage.getItem('dailyTasks');
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('dailyTasksDate');
    
    // If we have saved tasks and they're from today, use them
    if (savedTasks && savedDate === today) {
      setTasks(JSON.parse(savedTasks));
      updateProgress(JSON.parse(savedTasks));
      setLoading(false);
    } else {
      // Otherwise generate new tasks for today
      generateDailyTasks();
    }
    
    // Debug information
    console.log('DailyRecommendation - Survey Data:', surveyData);
    console.log('DailyRecommendation - Unlocked Games:', unlockedGames);
  }, [surveyData, unlockedGames]);
  
  // Generate daily recommendation and tasks
  useEffect(() => {
    if (surveyData) {
      // Import the gameRecommender dynamically to avoid circular dependencies
      import('../utils/mlModel').then(module => {
        const gameRecommender = module.default;
        const recommendation = gameRecommender.generateDailyRecommendation(surveyData);
        setDailyRecommendation(recommendation);
      });
    }
  }, [surveyData]);
  
  // Generate tasks based on focus areas
  const generateDailyTasks = () => {
    if (!surveyData) {
      setLoading(false);
      return;
    }
    
    // Import the gameRecommender dynamically
    import('../utils/mlModel').then(module => {
      const gameRecommender = module.default;
      const recommendation = gameRecommender.generateDailyRecommendation(surveyData);
      
      if (recommendation) {
        // Generate 3-5 tasks based on focus areas
        const newTasks = [];
        const focusAreas = recommendation.focusAreas || [];
        
        // If we have unlocked games, add them to the recommendation
        if (unlockedGames && unlockedGames.length > 0) {
          recommendation.recommendedGames = unlockedGames.slice(0, 3);
        }
        
        // Task templates based on focus areas
        const taskTemplates = {
          'math': ['Complete a math puzzle', 'Practice addition/subtraction', 'Solve a logic problem'],
          'logic': ['Complete a pattern recognition task', 'Solve a puzzle game', 'Practice sequencing'],
          'puzzles': ['Complete a jigsaw puzzle', 'Solve a maze', 'Play a matching game'],
          'reading': ['Read a short story', 'Practice sight words', 'Complete a reading comprehension task'],
          'writing': ['Write a short story', 'Practice handwriting', 'Create a journal entry'],
          'language': ['Learn new vocabulary words', 'Practice spelling', 'Complete a grammar exercise'],
          'science': ['Conduct a simple experiment', 'Learn about animals', 'Explore nature concepts'],
          'nature': ['Identify plants or animals', 'Learn about ecosystems', 'Explore weather patterns'],
          'technology': ['Practice basic coding', 'Learn about digital tools', 'Explore educational apps'],
          'social': ['Practice conversation skills', 'Role-play social scenarios', 'Learn about emotions'],
          'communication': ['Practice turn-taking', 'Work on listening skills', 'Express feelings appropriately'],
          'arts': ['Create a drawing or painting', 'Make a craft project', 'Explore colors and textures'],
          'music': ['Listen to different music genres', 'Play a simple instrument', 'Create rhythm patterns'],
          'creativity': ['Design something new', 'Use imagination in play', 'Create a story'],
          'games': ['Play an educational game', 'Complete a strategy game', 'Engage in cooperative play'],
          'history': ['Learn about historical figures', 'Explore different time periods', 'Discover cultural traditions'],
          'culture': ['Learn about different countries', 'Explore cultural traditions', 'Try international activities']
        };
        
        // Select 3-5 tasks based on today's focus areas
        focusAreas.forEach(area => {
          if (taskTemplates[area] && newTasks.length < 5) {
            // Randomly select a task from the templates for this area
            const randomTask = taskTemplates[area][Math.floor(Math.random() * taskTemplates[area].length)];
            newTasks.push({
              id: Date.now() + Math.random(),
              task: randomTask,
              completed: false,
              area: area
            });
          }
        });
        
        // Ensure we have at least 3 tasks
        while (newTasks.length < 3) {
          // Pick a random focus area
          const randomArea = Object.keys(taskTemplates)[Math.floor(Math.random() * Object.keys(taskTemplates).length)];
          const randomTask = taskTemplates[randomArea][Math.floor(Math.random() * taskTemplates[randomArea].length)];
          
          // Check if this task is already in our list
          if (!newTasks.some(t => t.task === randomTask)) {
            newTasks.push({
              id: Date.now() + Math.random(),
              task: randomTask,
              completed: false,
              area: randomArea
            });
          }
        }
        
        setTasks(newTasks);
        setDailyRecommendation(recommendation);
        
        // Save to localStorage
        localStorage.setItem('dailyTasks', JSON.stringify(newTasks));
        localStorage.setItem('dailyTasksDate', new Date().toDateString());
        
        // Initialize progress
        updateProgress(newTasks);
        
        // Set loading to false
        setLoading(false);
      }
    });
  };
  
  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
    
    // Save updated tasks to localStorage
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
  };
  
  // Update progress percentage
  const updateProgress = (currentTasks) => {
    if (currentTasks.length === 0) return;
    
    const completedCount = currentTasks.filter(task => task.completed).length;
    const progressPercentage = (completedCount / currentTasks.length) * 100;
    setProgress(progressPercentage);
  };
  
  // Reset tasks for testing purposes
  const resetTasks = () => {
    localStorage.removeItem('dailyTasks');
    localStorage.removeItem('dailyTasksDate');
    generateDailyTasks();
  };
  
  if (loading) {
    return (
      <StyledPaper elevation={3}>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={3}>
          <Typography variant="h6" gutterBottom>Loading your personalized recommendations...</Typography>
          <LinearProgress style={{ width: '100%', marginTop: 20 }} />
        </Box>
      </StyledPaper>
    );
  }
  
  if (!dailyRecommendation && !loading) {
    return (
      <StyledPaper elevation={3}>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={3}>
          <Typography variant="h6" gutterBottom>No recommendations available</Typography>
          <Typography variant="body2" color="textSecondary" align="center" paragraph>
            Please complete the survey to get personalized recommendations.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={generateDailyTasks}
          >
            Refresh Recommendations
          </Button>
        </Box>
      </StyledPaper>
    );
  }
  
  return (
    <StyledPaper elevation={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <span role="img" aria-label="calendar" style={{ marginRight: '8px', fontSize: '1.5rem' }}>📅</span>
        <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
          Daily Learning Plan
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        {dailyRecommendation.message}
      </Typography>
      
      <ChipContainer>
        {dailyRecommendation.focusAreas.map((area, index) => (
          <Chip 
            key={index} 
            label={area} 
            color="primary" 
            variant="outlined" 
            size="small" 
          />
        ))}
      </ChipContainer>
      
      <ProgressContainer>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Today's Progress
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              backgroundColor: progress === 100 ? '#4caf50' : '#2196f3',
            }
          }} 
        />
      </ProgressContainer>
      
      <Typography variant="h6" component="h3" mt={3} mb={2}>
        Today's Learning Tasks
      </Typography>
      
      {tasks.map((task) => (
        <TaskItem key={task.id} completed={task.completed} onClick={() => toggleTaskCompletion(task.id)}>
          {task.completed ? 
            <span role="img" aria-label="completed" style={{ marginRight: '8px', fontSize: '1.2rem', color: '#4caf50' }}>✅</span> : 
            <span role="img" aria-label="not completed" style={{ marginRight: '8px', fontSize: '1.2rem', color: '#9e9e9e' }}>⭕</span>
          }
          <Box>
            <Typography 
              variant="body1" 
              sx={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary'
              }}
            >
              {task.task}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Focus: {task.area}
            </Typography>
          </Box>
        </TaskItem>
      ))}
      
      {/* Recommended Games Section */}
      {dailyRecommendation && dailyRecommendation.recommendedGames && dailyRecommendation.recommendedGames.length > 0 && (
        <Box mt={4}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Recommended Games
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {dailyRecommendation.recommendedGames.map((game, index) => (
              <Paper 
                key={index} 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  width: '100%',
                  maxWidth: '300px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>{game.title || 'Game ' + (index + 1)}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {game.description || 'This game helps develop skills in ' + dailyRecommendation.focusAreas.join(', ')}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  href={`/games/${game.id}`}
                >
                  Play Now
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <Button 
          variant="outlined" 
          size="small" 
          onClick={resetTasks} 
          sx={{ mt: 2 }}
        >
          Reset Tasks (Dev Only)
        </Button>
      )}
    </StyledPaper>
  );
};

export default DailyRecommendation;