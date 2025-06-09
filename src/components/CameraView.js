import React, { useRef, useState } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { CameraAlt, Cameraswitch, PhotoCamera } from '@mui/icons-material';
import { logger } from '../utils/logger';
import { validateImage, compressImage } from '../utils/imageUtils';
import WebApp from '@twa-dev/sdk';

const CameraView = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      logger.error('Ошибка доступа к камере:', err);
      WebApp.showAlert('Не удалось получить доступ к камере. Проверьте разрешения.');
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      let imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Валидируем изображение
      validateImage(imageDataUrl);
      
      // Сжимаем изображение если нужно
      imageDataUrl = await compressImage(imageDataUrl);
      
      logger.debug('Image captured and processed', { size: imageDataUrl.length });
      
      onCapture(imageDataUrl);
      stopCamera();
    } catch (error) {
      logger.error('Ошибка при захвате фото:', error);
      WebApp.showAlert('Не удалось сделать фото. Попробуйте еще раз.');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'black',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      <Paper
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.5)',
          borderRadius: '24px 24px 0 0'
        }}
        elevation={0}
      >
        <IconButton
          onClick={onClose}
          sx={{ color: 'white' }}
          disabled={isCapturing}
        >
          <CameraAlt />
        </IconButton>
        
        <IconButton
          onClick={handleCapture}
          disabled={isCapturing}
          sx={{
            width: 72,
            height: 72,
            border: '4px solid white',
            bgcolor: 'transparent',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            '&.Mui-disabled': {
              opacity: 0.5,
              border: '4px solid rgba(255,255,255,0.5)'
            }
          }}
        >
          <PhotoCamera sx={{ color: 'white', fontSize: 32 }} />
        </IconButton>

        <IconButton
          onClick={toggleCamera}
          sx={{ color: 'white' }}
          disabled={isCapturing}
        >
          <Cameraswitch />
        </IconButton>
      </Paper>

      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'white',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {isCapturing ? 'Обработка...' : 'Наведите камеру на еду'}
      </Typography>
    </Box>
  );
};

export default CameraView; 