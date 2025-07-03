import React from 'react';
import './ContentCard.css';

const ContentCard = ({ article, language }) => {
  const getLabel = (en, zh) => (language === "EN" ? en : zh);

  const labels = {
    category: getLabel("Category", "类别"),
    source: getLabel("Source", "来源"),
    date: getLabel("Date", "日期"),
    readMore: getLabel("Read More", "阅读更多"),
    lastScraped: getLabel("Last Scraped", "最后抓取时间")

  };

  return (
    <div className="card">
      <img
        src={article.link}
        alt={article.englishTitle}
        className="card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/400x250?text=Image+Unavailable';
        }}
      />

      <p>🗂️ <strong>{labels.category}:</strong> {language === "EN" ? article.englishCategory : article.chineseCategory}</p>

      <p>
        📍 <strong>{labels.source}:</strong>{" "}
        {(() => {
          const sourceMap = {
            mef: { name: getLabel("Ministry of Economy and Finance", "经济与财政部"), url: "https://mef.gov.kh/" },
            tourism: { name: getLabel("Ministry of Tourism", "旅游部"), url: "https://tourism.gov.kh/category/news/" },
            khmertimes: { name: getLabel("Khmer Times", "高棉时报"), url: "https://www.khmertimeskh.com/" },
            ppp: { name: getLabel("Phnom Penh Post", "金边邮报"), url: "https://www.phnompenhpost.com/" },
            cdc: { name: getLabel("Council for the Development of Cambodia", "柬埔寨发展委员会"), url: "https://cdc.gov.kh/" },
            customs: { name: getLabel("General Department of Customs and Excise of Cambodia", "柬埔寨海关总署"), url: "https://www.customs.gov.kh/en/news-and-events?page=1" },
          };

          const src = article.englishSource?.toLowerCase();
          const sourceInfo = sourceMap[src];

          return sourceInfo ? (
            <a href={sourceInfo.url} target="_blank" rel="noopener noreferrer">
              {sourceInfo.name}
            </a>
          ) : (
            language === "EN" ? article.englishSource : article.chineseSource
          );
        })()}
      </p>

      <h2 className="card-title">
        {language === "EN" ? article.englishTitle : article.chineseTitle}
      </h2>

      <p>📅 <strong>{labels.date}:</strong> {language === "EN" ? article.englishDate : article.chineseDate}</p>
      
      {article.lastScraped && (
        <p>⏱️ <strong>{labels.lastScraped}: </strong> 
          {new Date(article.lastScraped).toLocaleString(language === "EN" ? 'en-US' : 'zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      )}
      
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="card-link"
      >
        🔗 {labels.readMore}
      </a>
    </div>
  );
};

export default ContentCard;
