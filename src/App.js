import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar,
  Card,
  CardContent,
  IconButton,
  Fade,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  CameraAlt as CameraIcon, 
  History as HistoryIcon, 
  Help as HelpIcon,
  ArrowBack as ArrowBackIcon,
  LocalDining as DiningIcon
} from '@mui/icons-material';
import WebApp from '@twa-dev/sdk';
import './styles/animations.css';

// Импортируем компоненты
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import DailyStats from './components/DailyStats';
import { analyzeFoodImage } from './services/foodRecognition';

// Создаем профессиональную тему
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7F5AF0', // Неоновый фиолетовый - основной акцент
      light: '#A78BFA', // Светло-фиолетовый
      dark: '#6D28D9', // Темно-фиолетовый
    },
    secondary: {
      main: '#2CB67D', // Изумрудный - дополнительный акцент
      light: '#4ADE80', // Светло-зеленый
      dark: '#059669', // Темно-зеленый
    },
    background: {
      default: '#16161A', // Глубокий темный
      paper: '#242629', // Темно-серый для карточек
    },
    text: {
      primary: '#FFFFFE', // Чистый белый
      secondary: '#94A1B2', // Серебристый
    },
    success: {
      main: '#2CB67D', // Изумрудный
      light: '#4ADE80',
    },
    warning: {
      main: '#FF8906', // Янтарный
      light: '#FCD34D',
    },
    info: {
      main: '#7F5AF0', // Неоновый фиолетовый
      light: '#A78BFA',
    },
    error: {
      main: '#EF4444', // Коралловый красный
      light: '#F87171',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#FFFFFE',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#FFFFFE',
    },
    body1: {
      color: '#FFFFFE',
      letterSpacing: '0.01em',
    },
    body2: {
      color: '#94A1B2',
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #7F5AF0 0%, #6D28D9 100%)',
          boxShadow: '0 4px 20px rgba(127, 90, 240, 0.15)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A78BFA 0%, #7F5AF0 100%)',
            boxShadow: '0 4px 25px rgba(127, 90, 240, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#7F5AF0',
          color: '#FFFFFE',
          '&:hover': {
            borderColor: '#A78BFA',
            backgroundColor: 'rgba(127, 90, 240, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#242629',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(148, 161, 178, 0.1)',
          borderRadius: 8,
          overflow: 'hidden',
        },
        barColorPrimary: {
          background: 'linear-gradient(90deg, #7F5AF0 0%, #A78BFA 100%)',
        },
        barColorSecondary: {
          background: 'linear-gradient(90deg, #2CB67D 0%, #4ADE80 100%)',
        },
        barColorWarning: {
          background: 'linear-gradient(90deg, #FF8906 0%, #FCD34D 100%)',
        },
        barColorInfo: {
          background: 'linear-gradient(90deg, #7F5AF0 0%, #6D28D9 100%)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFE',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(127, 90, 240, 0.08)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(127, 90, 240, 0.1)',
          color: '#7F5AF0',
          '&.MuiChip-clickable:hover': {
            backgroundColor: 'rgba(127, 90, 240, 0.15)',
          },
        },
      },
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    // Инициализация Telegram Mini App
    WebApp.ready();
    // Установка основного цвета для кнопки назад
    WebApp.setHeaderColor('#008BEE');
  }, []);

  const handleScanFood = () => {
    setShowCamera(true);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handleImageCapture = async (imageDataUrl) => {
    setShowCamera(false);
    setLoading(true);
    setCapturedImage(imageDataUrl);

    try {
      const result = await analyzeFoodImage(imageDataUrl);
      setAnalysisResult(result);
      setCurrentView('result');
    } catch (error) {
      WebApp.showAlert('Ошибка при анализе фото. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultSave = (updatedData) => {
    setAnalysisResult(updatedData);
  };

  const handleResultSkip = () => {
    setCurrentView('main');
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  const handleShowHistory = () => {
    setCurrentView('history');
  };

  const renderMainView = () => (
    <Fade in={true}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card className="card-hover fade-in" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <DiningIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">
                👋 Добро пожаловать!
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Отправьте фото еды, и искусственный интеллект определит калорийность блюда.
            </Typography>
          </CardContent>
        </Card>

        <DailyStats />

        <Button
          variant="contained"
          startIcon={<CameraIcon />}
          size="large"
          onClick={handleScanFood}
          className="pulse-button ripple scale-in"
          fullWidth
        >
          Сканировать еду
        </Button>

        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={handleShowHistory}
          className="ripple scale-in"
          fullWidth
        >
          История сканирований
        </Button>

        <Button
          variant="outlined"
          startIcon={<HelpIcon />}
          className="ripple scale-in"
          fullWidth
        >
          Помощь
        </Button>
      </Box>
    </Fade>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Калории AI
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : showCamera ? (
            <CameraView
              onCapture={handleImageCapture}
              onClose={handleCameraClose}
            />
          ) : currentView === 'result' ? (
            <ResultView
              imageUrl={capturedImage}
              initialData={analysisResult}
              onBack={() => setCurrentView('main')}
              onSave={handleResultSave}
              onSkip={handleResultSkip}
            />
          ) : currentView === 'history' ? (
            <HistoryView
              onBack={() => setCurrentView('main')}
            />
          ) : (
            renderMainView()
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 