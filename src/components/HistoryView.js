import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  Button,
  CardMedia
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getHistory, deleteFromHistory, clearHistory } from '../services/historyService';

const HistoryView = ({ onBack }) => {
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id) => {
    deleteFromHistory(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        {history.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={handleClearAll}
          >
            Очистить историю
          </Button>
        )}
      </Box>

      {history.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              История пуста
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ p: 0 }}>
          {history.map((item) => (
            <Card key={item.id} sx={{ mb: 2, display: 'flex' }} className="fade-in">
              {item.imageUrl && (
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'cover' }}
                  image={item.imageUrl}
                  alt={item.name}
                />
              )}
              <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" component="div" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {formatDate(item.timestamp)}
                      </Typography>
                      <Typography variant="body2">
                        {item.calories} ккал • Б: {item.protein}г • Ж: {item.fats}г • У: {item.carbs}г
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={() => handleDelete(item.id)}
                      sx={{ ml: 1 }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HistoryView; 