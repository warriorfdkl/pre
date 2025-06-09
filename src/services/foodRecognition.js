import { analyzeFood } from './nutritionService';
import { logger } from '../utils/logger';
import { showUserAlert } from '../utils/twaUtils';
import WebApp from '@twa-dev/sdk';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const analyzeFoodImage = async (imageBase64) => {
  try {
    if (!API_KEY) {
      logger.error('OpenAI API key is not configured');
      throw new Error('API key is not configured');
    }

    logger.info('Starting food analysis');

    // Проверяем и форматируем base64
    const base64Image = imageBase64.startsWith('data:image') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    // Первый запрос к ChatGPT для распознавания еды
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Опиши что за еда на фото и примерный размер порции в граммах. Формат ответа строго такой: 'food: название блюда, weight: вес в граммах'. Пример: 'food: куриная грудка с рисом, weight: 350'"
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('OpenAI API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to analyze image');
    }

    const data = await response.json();
    logger.debug('OpenAI Response:', data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const result = data.choices[0].message.content;
    logger.debug('Parsed result:', result);
    
    // Парсим результат
    const foodMatch = result.match(/food: (.*?),/);
    const weightMatch = result.match(/weight: (\d+)/);
    
    if (!foodMatch || !weightMatch) {
      logger.error('Parse Error. Response:', result);
      throw new Error('Failed to parse food recognition result');
    }

    const foodName = foodMatch[1];
    const weight = parseInt(weightMatch[1]);

    // Второй запрос к Nutrition API для получения пищевой ценности
    const nutritionData = await analyzeFood(`${weight}g ${foodName}`);

    const finalResult = {
      name: foodName,
      weight: weight,
      ...nutritionData,
      timestamp: new Date().toISOString()
    };

    logger.debug('Final result:', finalResult);
    return finalResult;

  } catch (error) {
    logger.error('Error in food recognition:', error);
    
    // Показываем пользователю понятное сообщение об ошибке
    let userMessage = 'Не удалось распознать еду на фото. Попробуйте еще раз.';
    
    if (error.message.includes('API key')) {
      userMessage = 'Ошибка конфигурации. Пожалуйста, обратитесь к администратору.';
    } else if (error.message.includes('Invalid response format')) {
      userMessage = 'Не удалось определить тип еды. Попробуйте сделать более четкое фото.';
    }
    
    showUserAlert(userMessage);
    throw error;
  }
}; 