// src/components/FilterBar.tsx
import React from 'react';

const FilterBar = ({ category, setCategory, language, setLanguage }) => (
  <div className="filter-bar">
    <label>
      🗂️ Category:
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Investment">Investment</option>
        <option value="Tourism">Tourism</option>
      </select>
    </label>

    <label>
      🌐 Language:
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="EN">🇺🇸 English</option>
        <option value="ZH">🇨🇳 中文</option>
      </select>
    </label>
  </div>
);

export default FilterBar;
