// src/utils/translateText.js
import axios from 'axios';

const API_KEY = 'AIzaSyAPWaSTwPBHhYZjQ3HS7Lwdu0uXkJZzudQ'; // 🔐 Replace with your actual API key

export const translateText = async (text, targetLang = 'zh') => {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          q: text,
          target: targetLang,
          format: 'text',
          key: API_KEY,
        },
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return '';
  }
};
