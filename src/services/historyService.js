const HISTORY_KEY = 'food_scan_history';

export const saveToHistory = (scanResult, imageUrl) => {
  try {
    const history = getHistory();
    const newEntry = {
      ...scanResult,
      imageUrl,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    history.unshift(newEntry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении в историю:', error);
    return false;
  }
};

export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Ошибка при получении истории:', error);
    return [];
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Ошибка при очистке истории:', error);
    return false;
  }
};

export const deleteFromHistory = (id) => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Ошибка при удалении из истории:', error);
    return false;
  }
}; 