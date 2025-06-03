import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  IconButton,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { getHistory } from '../services/historyService';
import Settings from './Settings';

const DailyStats = () => {
  const [stats, setStats] = useState({
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0
  });

  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 75,
    fats: 60,
    carbs: 250
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Загружаем сохраненные цели
    const savedGoals = localStorage.getItem('dailyGoals');
    if (savedGoals) {
      setDailyGoals(JSON.parse(savedGoals));
    }

    calculateDailyStats();
    
    // Подписываемся на события
    const handleFoodSaved = () => calculateDailyStats();
    const handleGoalsUpdated = () => {
      const updatedGoals = localStorage.getItem('dailyGoals');
      if (updatedGoals) {
        setDailyGoals(JSON.parse(updatedGoals));
      }
    };
    
    window.addEventListener('foodSaved', handleFoodSaved);
    window.addEventListener('goalsUpdated', handleGoalsUpdated);
    
    return () => {
      window.removeEventListener('foodSaved', handleFoodSaved);
      window.removeEventListener('goalsUpdated', handleGoalsUpdated);
    };
  }, []);

  const calculateDailyStats = () => {
    const history = getHistory();
    const today = new Date().setHours(0, 0, 0, 0);
    
    const todayStats = history.reduce((acc, item) => {
      const itemDate = new Date(item.timestamp).setHours(0, 0, 0, 0);
      if (itemDate === today) {
        acc.calories += Number(item.calories) || 0;
        acc.protein += Number(item.protein) || 0;
        acc.fats += Number(item.fats) || 0;
        acc.carbs += Number(item.carbs) || 0;
      }
      return acc;
    }, {
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0
    });

    setStats(todayStats);
  };

  const calculateProgress = (current, goal) => {
    const progress = (current / goal) * 100;
    return Math.min(progress, 100);
  };

  return (
    <>
      <Card className="fade-in" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              color: '#FFFFFE'
            }}>
              📊 Статистика за сегодня
            </Typography>
            <IconButton 
              onClick={() => setSettingsOpen(true)}
              sx={{ 
                color: '#7F5AF0',
                '&:hover': {
                  backgroundColor: 'rgba(127, 90, 240, 0.08)',
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    Калории
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    {stats.calories} / {dailyGoals.calories} ккал
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(stats.calories, dailyGoals.calories)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(127, 90, 240, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #7F5AF0 0%, #A78BFA 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    Белки
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    {stats.protein}г
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(stats.protein, dailyGoals.protein)}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(44, 182, 125, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #2CB67D 0%, #4ADE80 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    Жиры
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    {stats.fats}г
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(stats.fats, dailyGoals.fats)}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 137, 6, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FF8906 0%, #FCD34D 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    Углеводы
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFE' }}>
                    {stats.carbs}г
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(stats.carbs, dailyGoals.carbs)}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(127, 90, 240, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #7F5AF0 0%, #6D28D9 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Settings 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </>
  );
};

export default DailyStats; 