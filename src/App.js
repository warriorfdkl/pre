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

// Импортируем новые компоненты
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import { analyzeFoodImage } from './services/foodRecognition';

// Создаем тему в стиле Telegram
const theme = createTheme({
  palette: {
    mode: WebApp.colorScheme || 'light',
    primary: {
      main: '#008BEE',
    },
    background: {
      default: WebApp.colorScheme === 'dark' ? '#1F1F1F' : '#F5F5F5',
      paper: WebApp.colorScheme === 'dark' ? '#2C2C2C' : '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 139, 238, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
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
    WebApp.showPopup({
      title: 'Успех',
      message: 'Данные успешно обновлены',
      buttons: [{ type: 'ok' }]
    });
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