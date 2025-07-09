// src/components/FilterBar.js
// import React, { useEffect, useState } from 'react';
// import './FilterBar.css';
// import { translateText } from '../utils/translateText';

// const defaultCategories = [
//   { key: 'All', label: '🏠 Home' },
//   { key: 'Investment', label: 'Investment' },
//   { key: 'Tourism', label: 'Tourism' },
//   { key: 'Regulations', label: 'Regulations' },
//   { key: 'International Cooperation', label: 'International Cooperation' },
//   { key: 'Major Infrastructure Projects', label: 'Major Infrastructure Projects' },
// ];

// const FilterBar = ({ category, setCategory, language, setLanguage }) => {
//   const [translatedCategories, setTranslatedCategories] = useState(defaultCategories);

//   useEffect(() => {
//     const translateCategories = async () => {
//       if (language === 'ZH') {
//         const translated = await Promise.all(
//           defaultCategories.map(async (cat) => {
//             const translatedLabel = await translateText(cat.label, 'zh');
//             return { ...cat, label: translatedLabel };
//           })
//         );
//         setTranslatedCategories(translated);
//       } else {
//         setTranslatedCategories(defaultCategories);
//       }
//     };

//     translateCategories();
//   }, [language]);

//   const handleCategoryClick = (catKey) => {
//     // When "Home" is clicked, set category to "Investment"
//     if (catKey === 'All') {
//       setCategory('Investment');
//     } else {
//       setCategory(catKey);
//     }
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-categories">
//         {translatedCategories.map((cat) => (
//           <button
//             key={cat.key}
//             className={`nav-button ${category === cat.key || (cat.key === 'All' && category === 'Investment') ? 'active' : ''}`}
//             onClick={() => handleCategoryClick(cat.key)}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>

//       <div className="navbar-language">
//         🌐
//         <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//           <option value="EN">🇺🇸 English</option>
//           <option value="ZH">🇨🇳 中文</option>
//         </select>
//       </div>
//     </nav>
//   );
// };

// export default FilterBar;

// src/components/FilterBar.js
import React, { useEffect, useState } from 'react';
import './FilterBar.css';

// Predefined translations for categories
const categoryTranslations = {
  '🏠 Home': '🏠 首页',
  'Investment': '投资',
  'Tourism': '旅游',
  'Regulations': '法规',
  'International Cooperation': '国际合作',
  'Major Infrastructure Projects': '重大基础设施项目'
};

const defaultCategories = [
  { key: 'All', label: '🏠 Home' },
  { key: 'Investment', label: 'Investment' },
  { key: 'Tourism', label: 'Tourism' },
  { key: 'Regulations', label: 'Regulations' },
  { key: 'International Cooperation', label: 'International Cooperation' },
  { key: 'Major Infrastructure Projects', label: 'Major Infrastructure Projects' },
];

const FilterBar = ({ category, setCategory, language, setLanguage }) => {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    if (language === 'ZH') {
      // Use predefined translations instead of API calls
      const translatedCategories = defaultCategories.map(cat => ({
        ...cat,
        label: categoryTranslations[cat.label] || cat.label
      }));
      setCategories(translatedCategories);
    } else {
      setCategories(defaultCategories);
    }
  }, [language]);

  const handleCategoryClick = (catKey) => {
    // When "Home" is clicked, set category to "Investment"
    if (catKey === 'All') {
      setCategory('Investment');
    } else {
      setCategory(catKey);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-categories">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`nav-button ${category === cat.key || (cat.key === 'All' && category === 'Investment') ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="navbar-language">
        🌐
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="EN">🇺🇸 English</option>
          <option value="ZH">🇨🇳 中文</option>
        </select>
      </div>
    </nav>
  );
};

export default FilterBar;