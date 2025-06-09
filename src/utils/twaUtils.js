import WebApp from '@twa-dev/sdk';
import { logger } from './logger';

export const showUserAlert = (message, fallbackToAlert = true) => {
  try {
    // Метод showAlert доступен с версии 6.2
    if (WebApp.isVersionAtLeast('6.2')) {
      WebApp.showAlert(message);
    } else if (fallbackToAlert) {
      alert(message);
    }
  } catch (e) {
    logger.error('Failed to show WebApp alert, falling back to standard alert.', e);
    if (fallbackToAlert) {
      alert(message);
    }
  }
}; 