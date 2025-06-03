import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  Slider,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ResultView = ({ imageUrl, initialData, onBack, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(initialData);

  const handleSave = () => {
    setIsEditing(false);
    onSave(data);
  };

  const handleSliderChange = (field) => (event, newValue) => {
    setData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={onBack} className="scale-in">
          <ArrowBackIcon />
        </IconButton>
        <IconButton 
          onClick={() => setIsEditing(!isEditing)}
          className="scale-in"
          color={isEditing ? "primary" : "default"}
        >
          {isEditing ? <SaveIcon onClick={handleSave} /> : <EditIcon />}
        </IconButton>
      </Box>

      <Card className="fade-in" sx={{ mb: 3, overflow: 'hidden' }}>
        <Box
          component="img"
          src={imageUrl}
          alt="Фото еды"
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover'
          }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {data.name}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Chip
              label={`${data.calories} ккал`}
              color="primary"
              sx={{ fontSize: '1.2rem' }}
            />
          </Box>

          {isEditing ? (
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Калории</Typography>
              <Slider
                value={data.calories}
                onChange={handleSliderChange('calories')}
                min={0}
                max={1000}
                step={10}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Typography gutterBottom>Белки (г)</Typography>
              <Slider
                value={data.protein}
                onChange={handleSliderChange('protein')}
                min={0}
                max={100}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Typography gutterBottom>Жиры (г)</Typography>
              <Slider
                value={data.fats}
                onChange={handleSliderChange('fats')}
                min={0}
                max={100}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Typography gutterBottom>Углеводы (г)</Typography>
              <Slider
                value={data.carbs}
                onChange={handleSliderChange('carbs')}
                min={0}
                max={100}
                step={0.5}
                valueLabelDisplay="auto"
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', flex: 1 }} className="card-hover">
                <Typography variant="h6">{data.protein}г</Typography>
                <Typography variant="body2" color="text.secondary">Белки</Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', flex: 1 }} className="card-hover">
                <Typography variant="h6">{data.fats}г</Typography>
                <Typography variant="body2" color="text.secondary">Жиры</Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', flex: 1 }} className="card-hover">
                <Typography variant="h6">{data.carbs}г</Typography>
                <Typography variant="body2" color="text.secondary">Углеводы</Typography>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          className="scale-in"
        >
          Сохранить изменения
        </Button>
      )}
    </Box>
  );
};

export default ResultView; 