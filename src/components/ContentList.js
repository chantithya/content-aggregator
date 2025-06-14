// src/components/ContentList.js
import React, { useEffect, useState } from 'react';
import ContentCard from './ContentCard';
import FilterBar from './FilterBar';
import './ContentList.css';
import { translateText } from '../utils/translateText';
import combinedPressReleases from '../data/combined_press_releases.json';
import Header from './Header';

const ContentList = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("EN");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Use the imported JSON data directly
        const data = combinedPressReleases;
        
        const translatedArticles = await Promise.all(
          data.map(async (article) => {
            const summary = article.description ? article.description.slice(0, 60) : '';
            const titleTranslated = article.title ? await translateText(article.title, 'zh') : '';
            const summaryTranslated = summary ? await translateText(summary, 'zh') : '';
            const categoryTranslated = article.category ? await translateText(article.category, 'zh') : '';
            const sourceTranslated = article.source ? await translateText(article.source, 'zh') : '';
            const dateTranslated = article.Date || article.date
              ? await translateText(article.Date || article.date, 'zh')
              : '';
        
            return {
              ...article,
              englishSummary: summary + "...",
              chineseSummary: summaryTranslated,
              englishTitle: article.title,
              chineseTitle: titleTranslated,
              englishCategory: article.category,
              chineseCategory: categoryTranslated,
              englishSource: article.source,
              chineseSource: sourceTranslated,
              englishDate: article.Date || article.date,
              chineseDate: dateTranslated,
            };
          })
        );
        
        setArticles(translatedArticles);
      } catch (error) {
        console.error("Error processing articles:", error);
      }
    };

    loadArticles();
  }, []);

  // 🧪 Filter articles
  const filteredArticles = category === "All"
    ? articles
    : articles.filter(article => article.category === category);

  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div>

      <Header language={language} />

      <FilterBar
        category={category}
        setCategory={setCategory}
        language={language}
        setLanguage={setLanguage}
      />

      <section className="grid">
        {currentArticles.map((article, index) => (
          <ContentCard key={index} article={article} language={language} />
        ))}
      </section>

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>◀ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next ▶</button>
      </div>
    </div>
  );
};

export default ContentList;