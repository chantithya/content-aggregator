import React, { useEffect, useState } from 'react';
import ContentCard from './ContentCard';
import FilterBar from './FilterBar';
import './ContentList.css';

const ContentList = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("EN");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    fetch('https://api.sampleapis.com/futurama/episodes')
      .then(res => res.json())
      .then(data => {
        const formatted = data.slice(0, 40).map((item, index) => ({
          title: item.title,
          description: item.desc,
          url: item.video,
          date: item.originalAirDate || "2024-01-01",
          category: index % 2 === 0 ? "Investment" : "Tourism",
          source: "Futurama API",
          fullContent: item.desc + " Full detailed content goes here...",
          englishSummary: item.desc.slice(0, 60) + "...",
          chineseSummary: "这是自动翻译的中文摘要。"
        }));
        setArticles(formatted);
      });
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
