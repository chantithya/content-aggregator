import React from 'react';
import './ContentCard.css';

const ContentCard = ({ article, language }) => (
    <div className="card">
      <p>📅 <strong>Date:</strong> {article.date}</p>
      <h2>📰 {article.title}</h2>
      <p>🗂️ <strong>Category:</strong> {article.category}</p>
      <p>🏷️ <strong>Source:</strong> {article.source}</p>
      <p>📄 <strong>Full Content:</strong> {article.fullContent}</p>
      {language === "EN" ? (
        <p>📝 <strong>English Summary:</strong> {article.englishSummary}</p>
      ) : (
        <p>🇨🇳 <strong>Chinese Summary:</strong> {article.chineseSummary}</p>
      )}
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        🔗 Read More
      </a>
    </div>
  );
  

export default ContentCard;
