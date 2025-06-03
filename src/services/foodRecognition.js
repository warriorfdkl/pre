const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const analyzeFoodImage = async (imageBase64) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Проанализируй это фото еды и предоставь следующую информацию в формате JSON: название блюда, калории на 100г, белки, жиры, углеводы. Ответ должен быть только в JSON формате."
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

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const result = JSON.parse(data.choices[0].message.content);
    return {
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      fats: result.fats,
      carbs: result.carbs
    };
  } catch (error) {
    console.error('Ошибка при анализе фото:', error);
    // Возвращаем примерные данные в случае ошибки
    return {
      name: 'Не удалось определить',
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0
    };
  }
}; 