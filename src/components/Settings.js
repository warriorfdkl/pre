import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';

const Settings = ({ open, onClose }) => {
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 75,
    fats: 60,
    carbs: 250
  });

  const [autoCalculate, setAutoCalculate] = useState(true);
  const [manualValues, setManualValues] = useState({
    protein: 75,
    fats: 60,
    carbs: 250
  });

  useEffect(() => {
    // Загружаем сохраненные цели при открытии
    const savedGoals = localStorage.getItem('dailyGoals');
    const savedAutoCalculate = localStorage.getItem('autoCalculateMacros');
    
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      setGoals(parsedGoals);
      setManualValues({
        protein: parsedGoals.protein,
        fats: parsedGoals.fats,
        carbs: parsedGoals.carbs
      });
    }
    
    if (savedAutoCalculate !== null) {
      setAutoCalculate(JSON.parse(savedAutoCalculate));
    }
  }, [open]);

  // Функция для расчета рекомендуемых БЖУ на основе калорий
  const calculateRecommendedMacros = (calories) => {
    // Рекомендуемое распределение: 30% белки, 30% жиры, 40% углеводы
    const proteinCalories = calories * 0.3;
    const fatCalories = calories * 0.3;
    const carbCalories = calories * 0.4;

    // Преобразуем калории в граммы (1г белка = 4 ккал, 1г жира = 9 ккал, 1г углеводов = 4 ккал)
    return {
      protein: Math.round(proteinCalories / 4),
      fats: Math.round(fatCalories / 9),
      carbs: Math.round(carbCalories / 4)
    };
  };

  const handleCaloriesChange = (event) => {
    const calories = Math.max(0, parseInt(event.target.value) || 0);
    
    if (autoCalculate) {
      const recommendedMacros = calculateRecommendedMacros(calories);
      setGoals({
        calories,
        ...recommendedMacros
      });
    } else {
      setGoals(prev => ({
        ...prev,
        calories
      }));
    }
  };

  const handleMacroChange = (field) => (event) => {
    const value = Math.max(0, parseInt(event.target.value) || 0);
    setGoals(prev => ({
      ...prev,
      [field]: value
    }));
    setManualValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoCalculateChange = (event) => {
    const isAuto = event.target.checked;
    setAutoCalculate(isAuto);
    localStorage.setItem('autoCalculateMacros', JSON.stringify(isAuto));

    if (isAuto) {
      const recommendedMacros = calculateRecommendedMacros(goals.calories);
      setGoals(prev => ({
        ...prev,
        ...recommendedMacros
      }));
    } else {
      setGoals(prev => ({
        ...prev,
        ...manualValues
      }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
    localStorage.setItem('autoCalculateMacros', JSON.stringify(autoCalculate));
    window.dispatchEvent(new Event('goalsUpdated'));
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: '#242629',
          minWidth: 320
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <Typography variant="h6">Настройка целей</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Дневная норма калорий"
            type="number"
            value={goals.calories}
            onChange={handleCaloriesChange}
            fullWidth
            InputProps={{
              inputProps: { min: 0 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                },
                '&:hover fieldset': {
                  borderColor: '#7F5AF0',
                },
              },
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 1,
            mt: 1 
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoCalculate}
                  onChange={handleAutoCalculateChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#7F5AF0',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#7F5AF0',
                    },
                  }}
                />
              }
              label="Автоматический расчет БЖУ"
            />
            <Tooltip title="30% белки, 30% жиры, 40% углеводы от общей калорийности" arrow>
              <IconButton size="small" sx={{ color: '#7F5AF0' }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <TextField
            label="Белки (г)"
            type="number"
            value={goals.protein}
            onChange={handleMacroChange('protein')}
            disabled={autoCalculate}
            fullWidth
            InputProps={{
              inputProps: { min: 0 }
            }}
            sx={{
              '& .Mui-disabled': {
                opacity: autoCalculate ? 0.7 : 1,
                '-webkit-text-fill-color': '#FFFFFE !important',
              }
            }}
          />
          
          <TextField
            label="Жиры (г)"
            type="number"
            value={goals.fats}
            onChange={handleMacroChange('fats')}
            disabled={autoCalculate}
            fullWidth
            InputProps={{
              inputProps: { min: 0 }
            }}
            sx={{
              '& .Mui-disabled': {
                opacity: autoCalculate ? 0.7 : 1,
                '-webkit-text-fill-color': '#FFFFFE !important',
              }
            }}
          />
          
          <TextField
            label="Углеводы (г)"
            type="number"
            value={goals.carbs}
            onChange={handleMacroChange('carbs')}
            disabled={autoCalculate}
            fullWidth
            InputProps={{
              inputProps: { min: 0 }
            }}
            sx={{
              '& .Mui-disabled': {
                opacity: autoCalculate ? 0.7 : 1,
                '-webkit-text-fill-color': '#FFFFFE !important',
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Отмена
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings; 