const API_KEY = process.env.REACT_APP_NUTRITION_API_KEY;
const API_URL = 'https://api.edamam.com/api/nutrition-data';

export const analyzeFood = async (foodText) => {
  try {
    const ingr = encodeURIComponent(foodText);
    const response = await fetch(
      `${API_URL}?app_id=${process.env.REACT_APP_NUTRITION_APP_ID}&app_key=${API_KEY}&ingr=${ingr}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();
    
    return {
      calories: Math.round(data.calories || 0),
      protein: Math.round(data.totalNutrients?.PROCNT?.quantity || 0),
      fats: Math.round(data.totalNutrients?.FAT?.quantity || 0),
      carbs: Math.round(data.totalNutrients?.CHOCDF?.quantity || 0),
      additionalNutrients: {
        fiber: Math.round(data.totalNutrients?.FIBTG?.quantity || 0),
        sugar: Math.round(data.totalNutrients?.SUGAR?.quantity || 0),
        sodium: Math.round(data.totalNutrients?.NA?.quantity || 0),
        cholesterol: Math.round(data.totalNutrients?.CHOLE?.quantity || 0),
      },
      measures: data.measures || [],
      weight: data.totalWeight || 0,
    };
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
}; 