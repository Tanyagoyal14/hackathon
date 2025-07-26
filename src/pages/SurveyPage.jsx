import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from '../components/ThemeSelector';

const SurveyPage = ({ setHasCompletedSurvey }) => {
  const navigate = useNavigate();
  const { updateGamesFromSurvey } = useGame();
  const { theme } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    learningGoals: [],
    interests: [],
    learningStyle: '',
    preferences: {
      colors: 'bright',
      sounds: 'moderate',
      complexity: 'medium',
      pace: 'medium',
      interactivity: 'medium'
    },
    specialNeeds: [],
    communicationPreferences: [],
    feedbackStyle: '',
    attentionSpan: 'medium',
    previousExperience: 'beginner'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSteps = 9;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const current = prev[category];
      
      if (current.includes(value)) {
        // Remove item if already selected
        return {
          ...prev,
          [category]: current.filter(item => item !== value)
        };
      } else {
        // Add item if not already selected
        return {
          ...prev,
          [category]: [...current, value]
        };
      }
    });
  };
  
  const handlePreferenceChange = (preference, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };
  
  const handleNextStep = () => {
    // Validate current step
    let isValid = true;
    
    if (currentStep === 1 && !formData.ageGroup) {
      alert('Please select an age group');
      isValid = false;
    } else if (currentStep === 2 && formData.learningGoals.length === 0) {
      alert('Please select at least one learning goal');
      isValid = false;
    } else if (currentStep === 3 && formData.interests.length === 0) {
      alert('Please select at least one interest');
      isValid = false;
    } else if (currentStep === 4 && !formData.learningStyle) {
      alert('Please select a learning style');
      isValid = false;
    } else if (currentStep === 6 && formData.communicationPreferences.length === 0) {
      alert('Please select at least one communication preference');
      isValid = false;
    } else if (currentStep === 7 && !formData.feedbackStyle) {
      alert('Please select a feedback style');
      isValid = false;
    } else if (currentStep === 8 && !formData.attentionSpan) {
      alert('Please select an attention span');
      isValid = false;
    } else if (currentStep === 9 && !formData.previousExperience) {
      alert('Please select previous experience level');
      isValid = false;
    }
    
    // Special case for age submission - if user only wants to submit age
    if (currentStep === 1 && formData.ageGroup && window.confirm('Would you like to only submit your age and skip the rest of the survey?')) {
      // Save only the age data
      const ageOnlyData = {
        ageGroup: formData.ageGroup,
        name: formData.name || 'User'
      };
      localStorage.setItem('surveyData', JSON.stringify(ageOnlyData));
      
      // Navigate to dashboard
      if (setHasCompletedSurvey) {
        setHasCompletedSurvey(true);
      }
      navigate('/dashboard');
      return;
    }
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save survey data to localStorage
      localStorage.setItem('surveyData', JSON.stringify(formData));
      
      // Update game recommendations based on survey
      updateGamesFromSurvey(formData);
      
      // Set survey as completed
      if (setHasCompletedSurvey) {
        setHasCompletedSurvey(true);
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const ageGroups = [
    { value: '4-7', label: '4-7 years' },
    { value: '8-12', label: '8-12 years' },
    { value: '13-16', label: '13-16 years' },
    { value: '17+', label: '17+ years' }
  ];
  
  const learningGoalsOptions = [
    { value: 'math', label: 'Mathematics', icon: '🔢' },
    { value: 'reading', label: 'Reading & Writing', icon: '📚' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'language', label: 'Language Skills', icon: '💬' },
    { value: 'art', label: 'Art & Creativity', icon: '🎨' },
    { value: 'social', label: 'Social Skills', icon: '👥' },
    { value: 'motor', label: 'Motor Skills', icon: '🤸‍♂️' },
    { value: 'logic', label: 'Logic & Problem Solving', icon: '🧩' }
  ];
  
  const interestsOptions = [
    { value: 'animals', label: 'Animals', icon: '🐾' },
    { value: 'space', label: 'Space & Astronomy', icon: '🚀' },
    { value: 'music', label: 'Music', icon: '🎵' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'cooking', label: 'Cooking', icon: '🍳' },
    { value: 'nature', label: 'Nature & Environment', icon: '🌱' },
    { value: 'history', label: 'History', icon: '🏛️' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'dinosaurs', label: 'Dinosaurs', icon: '🦕' },
    { value: 'superheroes', label: 'Superheroes', icon: '🦸‍♂️' },
    { value: 'fantasy', label: 'Fantasy & Magic', icon: '🧙‍♂️' },
    { value: 'vehicles', label: 'Vehicles', icon: '🚗' }
  ];
  
  const learningStyleOptions = [
    { value: 'visual', label: 'Visual Learner', description: 'Learns best through images, diagrams, and spatial understanding' },
    { value: 'auditory', label: 'Auditory Learner', description: 'Learns best through listening and verbal instruction' },
    { value: 'reading', label: 'Reading/Writing Learner', description: 'Learns best through reading and writing activities' },
    { value: 'kinesthetic', label: 'Kinesthetic Learner', description: 'Learns best through hands-on activities and movement' },
    { value: 'multimodal', label: 'Multimodal Learner', description: 'Learns through a combination of styles' }
  ];
  
  const specialNeedsOptions = [
    { value: 'adhd', label: 'ADHD', description: 'Attention-Deficit/Hyperactivity Disorder' },
    { value: 'asd', label: 'Autism Spectrum', description: 'Autism Spectrum Disorder' },
    { value: 'dyslexia', label: 'Dyslexia', description: 'Reading difficulty' },
    { value: 'dyscalculia', label: 'Dyscalculia', description: 'Math learning difficulty' },
    { value: 'sensory', label: 'Sensory Processing', description: 'Sensory processing sensitivities' },
    { value: 'anxiety', label: 'Anxiety', description: 'Anxiety or stress management needs' },
    { value: 'gifted', label: 'Gifted', description: 'Advanced learning capabilities' },
    { value: 'none', label: 'None', description: 'No specific learning considerations' }
  ];
  
  const communicationPreferencesOptions = [
    { value: 'visual_instructions', label: 'Visual Instructions', icon: '👁️' },
    { value: 'written_instructions', label: 'Written Instructions', icon: '📝' },
    { value: 'verbal_instructions', label: 'Verbal Instructions', icon: '🗣️' },
    { value: 'demonstrations', label: 'Demonstrations', icon: '👨‍🏫' },
    { value: 'step_by_step', label: 'Step-by-Step Guidance', icon: '📋' },
    { value: 'independent', label: 'Independent Exploration', icon: '🔍' }
  ];
  
  const feedbackStyleOptions = [
    { value: 'immediate', label: 'Immediate Feedback', description: 'Provide feedback right after each action or answer' },
    { value: 'delayed', label: 'Delayed Feedback', description: 'Provide feedback after completing a full activity' },
    { value: 'positive', label: 'Positive Reinforcement', description: 'Focus on what was done correctly' },
    { value: 'constructive', label: 'Constructive Guidance', description: 'Provide specific suggestions for improvement' },
    { value: 'visual', label: 'Visual Feedback', description: 'Use visual cues and animations for feedback' }
  ];
  
  const attentionSpanOptions = [
    { value: 'short', label: 'Short Attention Span', description: 'Prefers brief activities under 5 minutes' },
    { value: 'medium', label: 'Medium Attention Span', description: 'Can focus on activities for 5-15 minutes' },
    { value: 'long', label: 'Long Attention Span', description: 'Can maintain focus for 15+ minutes' },
    { value: 'variable', label: 'Variable Attention Span', description: 'Attention span varies based on interest level' }
  ];
  
  const previousExperienceOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to most educational games and activities' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience with educational games' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced with many educational games and activities' }
  ];
  
  // Progress indicator
  const Progress = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-indigo-600"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
  
  const renderStep = () => {
    switch (currentStep) {
      case 8:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Attention Span</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              How long can the learner typically focus on a single activity?
            </p>
            
            <div className="space-y-3 mb-4">
              {attentionSpanOptions.map(option => (
                <label
                  key={option.value}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.attentionSpan === option.value 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="attentionSpan"
                      value={option.value}
                      checked={formData.attentionSpan === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      formData.attentionSpan === option.value
                        ? 'text-indigo-800 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </label>
              ))}
            </div>
          </>
        );
        
      case 9:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Previous Experience</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              What is the learner's experience level with educational games?
            </p>
            
            <div className="space-y-3 mb-4">
              {previousExperienceOptions.map(option => (
                <label
                  key={option.value}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.previousExperience === option.value 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="previousExperience"
                      value={option.value}
                      checked={formData.previousExperience === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      formData.previousExperience === option.value
                        ? 'text-indigo-800 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </label>
              ))}
            </div>
          </>
        );
        
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tell us about the learner</h2>
            
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter first name"
              />
            </div>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Group
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ageGroups.map(group => (
                    <label
                      key={group.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.ageGroup === group.value 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ageGroup"
                        value={group.value}
                        checked={formData.ageGroup === group.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className={`text-sm ${
                        formData.ageGroup === group.value
                          ? 'text-indigo-800 dark:text-indigo-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {group.label}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  You can submit just your age and skip the rest of the survey if you prefer.
                </p>
              </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Learning Goals</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select the main subjects you'd like to focus on (choose up to 3)
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {learningGoalsOptions.map(goal => (
                <label
                  key={goal.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.learningGoals.includes(goal.value) 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.learningGoals.includes(goal.value)}
                    onChange={() => handleCheckboxChange('learningGoals', goal.value)}
                    className="sr-only"
                    disabled={formData.learningGoals.length >= 3 && !formData.learningGoals.includes(goal.value)}
                  />
                  <span className="text-xl mr-2">{goal.icon}</span>
                  <span className={`text-sm ${
                    formData.learningGoals.includes(goal.value)
                      ? 'text-indigo-800 dark:text-indigo-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {goal.label}
                  </span>
                </label>
              ))}
            </div>
            
            {formData.learningGoals.length >= 3 && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Maximum 3 subjects selected. Unselect one to change your choices.
              </p>
            )}
          </>
        );
        
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interests & Hobbies</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select topics the learner finds interesting (choose up to 5)
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {interestsOptions.map(interest => (
                <label
                  key={interest.value}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.interests.includes(interest.value) 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest.value)}
                    onChange={() => handleCheckboxChange('interests', interest.value)}
                    className="sr-only"
                    disabled={formData.interests.length >= 5 && !formData.interests.includes(interest.value)}
                  />
                  <span className="text-2xl mb-1">{interest.icon}</span>
                  <span className={`text-xs text-center ${
                    formData.interests.includes(interest.value)
                      ? 'text-indigo-800 dark:text-indigo-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {interest.label}
                  </span>
                </label>
              ))}
            </div>
            
            {formData.interests.length >= 5 && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Maximum 5 interests selected. Unselect one to change your choices.
              </p>
            )}
          </>
        );
        
      case 4:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Learning Style</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select the learning style that best matches the learner
            </p>
            
            <div className="space-y-3 mb-4">
              {learningStyleOptions.map(style => (
                <label
                  key={style.value}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.learningStyle === style.value 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="learningStyle"
                      value={style.value}
                      checked={formData.learningStyle === style.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      formData.learningStyle === style.value
                        ? 'text-indigo-800 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {style.description}
                  </p>
                </label>
              ))}
            </div>
          </>
        );
        
      case 5:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Special Considerations</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select any learning considerations that apply (optional)
            </p>
            
            <div className="space-y-3 mb-8">
              {specialNeedsOptions.map(need => (
                <label
                  key={need.value}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.specialNeeds.includes(need.value) 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialNeeds.includes(need.value)}
                      onChange={() => handleCheckboxChange('specialNeeds', need.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className={`ml-3 text-sm font-medium ${
                      formData.specialNeeds.includes(need.value)
                        ? 'text-indigo-800 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {need.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 pl-7">
                    {need.description}
                  </p>
                </label>
              ))}
            </div>
          </>
        );
        
      case 6:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Communication Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              How does the learner prefer to receive instructions? (choose up to 3)
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {communicationPreferencesOptions.map(pref => (
                <label
                  key={pref.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.communicationPreferences.includes(pref.value) 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.communicationPreferences.includes(pref.value)}
                    onChange={() => handleCheckboxChange('communicationPreferences', pref.value)}
                    className="sr-only"
                    disabled={formData.communicationPreferences.length >= 3 && !formData.communicationPreferences.includes(pref.value)}
                  />
                  <span className="text-xl mr-2">{pref.icon}</span>
                  <span className={`text-sm ${
                    formData.communicationPreferences.includes(pref.value)
                      ? 'text-indigo-800 dark:text-indigo-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {pref.label}
                  </span>
                </label>
              ))}
            </div>
            
            {formData.communicationPreferences.length >= 3 && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Maximum 3 options selected. Unselect one to change your choices.
              </p>
            )}
          </>
        );
        
      case 7:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Feedback Style</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select the feedback style that works best for the learner
            </p>
            
            <div className="space-y-3 mb-4">
              {feedbackStyleOptions.map(style => (
                <label
                  key={style.value}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.feedbackStyle === style.value 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="feedbackStyle"
                      value={style.value}
                      checked={formData.feedbackStyle === style.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      formData.feedbackStyle === style.value
                        ? 'text-indigo-800 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {style.description}
                  </p>
                </label>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Display Preferences</h3>
              
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Color Scheme
                </label>
                <div className="flex space-x-4">
                  {['muted', 'moderate', 'bright'].map(option => (
                    <label 
                      key={option}
                      className={`flex-1 flex flex-col items-center p-3 border rounded-lg cursor-pointer ${
                        formData.preferences.colors === option
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.preferences.colors === option}
                        onChange={() => handlePreferenceChange('colors', option)}
                        className="sr-only"
                      />
                      <div 
                        className={`w-full h-8 rounded mb-2 ${
                          option === 'muted' ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                          option === 'moderate' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                          'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                      ></div>
                      <span className="text-xs capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Sound Effects
                </label>
                <div className="flex space-x-4">
                  {['none', 'minimal', 'moderate'].map(option => (
                    <label 
                      key={option}
                      className={`flex-1 text-center p-3 border rounded-lg cursor-pointer ${
                        formData.preferences.sounds === option
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.preferences.sounds === option}
                        onChange={() => handlePreferenceChange('sounds', option)}
                        className="sr-only"
                      />
                      <span className="text-xs capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Visual Complexity
                </label>
                <div className="flex space-x-4">
                  {['simple', 'medium', 'detailed'].map(option => (
                    <label 
                      key={option}
                      className={`flex-1 text-center p-3 border rounded-lg cursor-pointer ${
                        formData.preferences.complexity === option
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.preferences.complexity === option}
                        onChange={() => handlePreferenceChange('complexity', option)}
                        className="sr-only"
                      />
                      <span className="text-xs capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header with theme selector */}
      <header className="py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">MoodWise</div>
        <ThemeSelector />
      </header>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden p-8">
            <Progress />
            
            <form onSubmit={handleSubmit}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`px-5 py-2.5 rounded-lg font-medium ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                  }`}
                >
                  Back
                </button>
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={currentStep === 6 && formData.communicationPreferences.length === 0}
                    className={`px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition ${
                      currentStep === 6 && formData.communicationPreferences.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {currentStep === 1 ? 'Submit Age & Continue' : 'Continue'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-70 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Create My Learning Hub'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This information helps us personalize the learning experience. Your privacy is important to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;