// src/utils/translateText.js
// import axios from 'axios';

// const API_KEY = 'AIzaSyC-yTnRnWeytse9w2qxEbncH5XI9SFulQs'; // 🔐 Replace with your actual API key

// export const translateText = async (text, targetLang = 'zh') => {
//   try {
//     const response = await axios.post(
//       `https://translation.googleapis.com/language/translate/v2`,
//       {},
//       {
//         params: {
//         q: text,
//         target: targetLang,
//         format: 'text',
//           key: API_KEY,
//         },
//       }
//     );
//     return response.data.data.translations[0].translatedText;
//   } catch (error) {
//     console.error('Translation error:', error);
//     return '';
//   }
// };


// src/utils/translateText.js
const translationCache = new Map();

export const translateText = async (text, targetLang = 'zh') => {
  if (!text.trim()) return '';
  
  const cacheKey = `${text.toLowerCase()}-${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    const data = await response.json();
    const translatedText = data[0].map(item => item[0]).join('');
    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    // console.error('Translation error:', error);
    return text;
  }
};

export const translateBatch = async (texts, targetLang = 'zh') => {
  try {
    // First check cache for all texts
    const cachedResults = texts.map(text => {
      const cacheKey = `${text.toLowerCase()}-${targetLang}`;
      return translationCache.has(cacheKey) ? translationCache.get(cacheKey) : null;
    });

    // If all texts are cached, return them
    if (cachedResults.every(result => result !== null)) {
      return cachedResults;
    }

    // Otherwise, translate only the uncached texts
    const textsToTranslate = texts.filter((text, index) => cachedResults[index] === null);
    const uniqueTexts = [...new Set(textsToTranslate)]; // Remove duplicates
    
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `q=${uniqueTexts.map(text => encodeURIComponent(text)).join('&q=')}`
      }
    );
    
    const data = await response.json();
    const translatedTexts = data[0].map(item => item[0]);

    // Cache the new translations
    uniqueTexts.forEach((text, index) => {
      const cacheKey = `${text.toLowerCase()}-${targetLang}`;
      translationCache.set(cacheKey, translatedTexts[index]);
    });

    // Combine cached and new translations
    return texts.map(text => {
      const cacheKey = `${text.toLowerCase()}-${targetLang}`;
      return translationCache.get(cacheKey) || text;
    });
  } catch (error) {
    // console.error('Batch translation error:', error);
    return texts;
  }
};