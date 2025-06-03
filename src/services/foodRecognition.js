import { analyzeFood } from './nutritionService';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const analyzeFoodImage = async (imageBase64) => {
  try {
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
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    
    // Парсим результат
    const foodMatch = result.match(/food: (.*?),/);
    const weightMatch = result.match(/weight: (\d+)/);
    
    if (!foodMatch || !weightMatch) {
      throw new Error('Failed to parse food recognition result');
    }

    const foodName = foodMatch[1];
    const weight = parseInt(weightMatch[1]);

    // Второй запрос к Nutrition API для получения пищевой ценности
    const nutritionData = await analyzeFood(`${weight}g ${foodName}`);

    return {
      name: foodName,
      weight: weight,
      ...nutritionData,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in food recognition:', error);
    throw error;
  }
}; 