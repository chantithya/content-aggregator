import React, { useEffect, useState } from 'react';
import './FilterBar.css';
import { translateText } from '../utils/translateText';

const defaultCategories = [
  { key: 'All', label: '🏠 Home' },
  { key: 'Investment', label: 'Investment' },
  { key: 'Tourism', label: 'Tourism' },
  { key: 'Regulations', label: 'Regulations' },
  { key: 'International Cooperation', label: 'International Cooperation' },
  { key: 'Major Infrastructure Projects', label: 'Major Infrastructure Projects' },
];

const FilterBar = ({ category, setCategory, language, setLanguage }) => {
  const [translatedCategories, setTranslatedCategories] = useState(defaultCategories);

  useEffect(() => {
    const translateCategories = async () => {
      if (language === 'ZH') {
        const translated = await Promise.all(
          defaultCategories.map(async (cat) => {
            const translatedLabel = await translateText(cat.label, 'zh');
            return { ...cat, label: translatedLabel };
          })
        );
        setTranslatedCategories(translated);
      } else {
        setTranslatedCategories(defaultCategories);
      }
    };

    translateCategories();
  }, [language]);

  return (
    <nav className="navbar">
      <div className="navbar-categories">
        {translatedCategories.map((cat) => (
          <button
            key={cat.key}
            className={`nav-button ${category === cat.key ? 'active' : ''}`}
            onClick={() => setCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="navbar-language">
        🌐
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="EN">🇺🇸 English</option>
          <option value="ZH">🇨🇳 中文</option>
        </select>
      </div>
    </nav>
  );
};

export default FilterBar;
