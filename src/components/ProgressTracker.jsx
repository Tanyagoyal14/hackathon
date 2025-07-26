import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Divider, Chip } from '@mui/material';
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

const ProgressCircle = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  margin: theme.spacing(2),
}));

const ProgressLabel = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1),
}));

const StreakChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
  marginLeft: theme.spacing(1),
}));

const ProgressTracker = () => {
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);
  
  useEffect(() => {
    // Load progress data from localStorage
    loadProgressData();
    
    // Check if we need to update the streak
    updateStreak();
  }, []);
  
  const loadProgressData = () => {
    // Get today's tasks and calculate progress
    const dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    if (dailyTasks.length > 0) {
      const completedCount = dailyTasks.filter(task => task.completed).length;
      const progressPercentage = (completedCount / dailyTasks.length) * 100;
      setProgress(progressPercentage);
      setTasksCompleted(completedCount);
    }
    
    // Get total tasks completed from all time
    const totalCompleted = parseInt(localStorage.getItem('totalTasksCompleted') || '0');
    setTotalTasksCompleted(totalCompleted);
    
    // Get current streak
    const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
    setStreak(currentStreak);
  };
  
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0');
    
    if (!lastActiveDate) {
      // First time user, initialize streak data
      localStorage.setItem('lastActiveDate', today);
      localStorage.setItem('currentStreak', '1');
      setStreak(1);
      return;
    }
    
    // Convert dates to Date objects for comparison
    const lastDate = new Date(lastActiveDate);
    const todayDate = new Date(today);
    
    // Calculate the difference in days
    const timeDiff = todayDate.getTime() - lastDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (dayDiff === 0) {
      // Same day, no streak update needed
      return;
    } else if (dayDiff === 1) {
      // Consecutive day, increase streak
      const newStreak = currentStreak + 1;
      localStorage.setItem('currentStreak', newStreak.toString());
      localStorage.setItem('lastActiveDate', today);
      setStreak(newStreak);
    } else {
      // Streak broken, reset to 1
      localStorage.setItem('currentStreak', '1');
      localStorage.setItem('lastActiveDate', today);
      setStreak(1);
    }
  };
  
  // Update total tasks completed when a task is marked as done
  useEffect(() => {
    const handleStorageChange = () => {
      const dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
      const completedCount = dailyTasks.filter(task => task.completed).length;
      
      // Update progress for today
      const progressPercentage = dailyTasks.length > 0 ? (completedCount / dailyTasks.length) * 100 : 0;
      setProgress(progressPercentage);
      setTasksCompleted(completedCount);
      
      // Update total tasks completed
      let totalCompleted = parseInt(localStorage.getItem('totalTasksCompleted') || '0');
      
      // Check if we need to update the total
      if (completedCount > 0 && completedCount !== tasksCompleted) {
        // Only count newly completed tasks
        const newlyCompleted = completedCount - tasksCompleted;
        if (newlyCompleted > 0) {
          totalCompleted += newlyCompleted;
          localStorage.setItem('totalTasksCompleted', totalCompleted.toString());
          setTotalTasksCompleted(totalCompleted);
        }
      }
    };
    
    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes when the component mounts
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [tasksCompleted]);
  
  // Get appropriate message based on progress
  const getProgressMessage = () => {
    if (progress === 0) return "Start your daily tasks to track progress!";
    if (progress < 25) return "You're just getting started. Keep going!";
    if (progress < 50) return "Making progress! You're on the right track.";
    if (progress < 75) return "Great work! You're well on your way.";
    if (progress < 100) return "Almost there! Just a few more tasks to go.";
    return "Amazing! You've completed all your tasks for today!";
  };
  
  return (
    <StyledPaper elevation={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <span role="img" aria-label="trending up" style={{ marginRight: '8px', fontSize: '1.5rem', color: '#2196f3' }}>📈</span>
        <Typography variant="h5" component="h2" color="primary" fontWeight="bold">
          Learning Progress
        </Typography>
        {streak > 0 && (
          <StreakChip 
            icon={<span role="img" aria-label="trophy" style={{ fontSize: '1.2rem' }}>🏆</span>} 
            label={`${streak} day streak`} 
            size="small" 
          />
        )}
      </Box>
      
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <ProgressCircle>
          <CircularProgress 
            variant="determinate" 
            value={progress} 
            size={120} 
            thickness={4} 
            sx={{ 
              color: progress === 100 ? '#4caf50' : '#2196f3',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <ProgressLabel>
            <Typography variant="h4" component="div" color="text.secondary">
              {`${Math.round(progress)}%`}
            </Typography>
          </ProgressLabel>
        </ProgressCircle>
        
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 1 }}>
          {getProgressMessage()}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <StatsContainer>
        <StatItem>
          <Typography variant="h6" color="primary">
            {tasksCompleted}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Today's Tasks
          </Typography>
        </StatItem>
        
        <StatItem>
          <Typography variant="h6" color="primary">
            {totalTasksCompleted}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Completed
          </Typography>
        </StatItem>
        
        <StatItem>
          <Typography variant="h6" color="primary">
            {streak}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Day Streak
          </Typography>
        </StatItem>
      </StatsContainer>
      
      {progress === 100 && (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          bgcolor="rgba(76, 175, 80, 0.1)" 
          p={2} 
          borderRadius={2}
        >
          <span role="img" aria-label="check circle" style={{ marginRight: '8px', fontSize: '1.5rem', color: '#4caf50' }}>✅</span>
          <Typography variant="body1" color="success.main">
            Congratulations! You've completed all tasks for today.
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};

export default ProgressTracker;