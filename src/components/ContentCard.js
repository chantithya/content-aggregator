// import React from 'react';
// import './ContentCard.css';

// const ContentCard = ({ article, language }) => {
//   const getLabel = (en, zh) => (language === "EN" ? en : zh);

//   const labels = {
//     category: getLabel("Category", "类别"),
//     source: getLabel("Source", "来源"),
//     date: getLabel("Date", "日期"),
//     readMore: getLabel("Read More", "阅读更多"),
//     lastScraped: getLabel("Last Scraped", "最后抓取时间")

//   };

//   return (
//     <div className="card">
//       <img
//         src={article.link}
//         alt={article.englishTitle}
//         className="card-image"
//         onError={(e) => {
//           e.target.onerror = null;
//           e.target.src = 'https://via.placeholder.com/400x250?text=Image+Unavailable';
//         }}
//       />

//       <p>🗂️ <strong>{labels.category}:</strong> {language === "EN" ? article.englishCategory : article.chineseCategory}</p>

//       <p>
//         📍 <strong>{labels.source}:</strong>{" "}
//         {(() => {
//           const sourceMap = {
//             mef: { name: getLabel("Ministry of Economy and Finance", "经济与财政部"), url: "https://mef.gov.kh/" },
//             tourism: { name: getLabel("Ministry of Tourism", "旅游部"), url: "https://tourism.gov.kh/category/news/" },
//             khmertimes: { name: getLabel("Khmer Times", "高棉时报"), url: "https://www.khmertimeskh.com/" },
//             ppp: { name: getLabel("Phnom Penh Post", "金边邮报"), url: "https://www.phnompenhpost.com/" },
//             cdc: { name: getLabel("Council for the Development of Cambodia", "柬埔寨发展委员会"), url: "https://cdc.gov.kh/" },
//             customs: { name: getLabel("General Department of Customs and Excise of Cambodia", "柬埔寨海关总署"), url: "https://www.customs.gov.kh/en/news-and-events?page=1" },
//           };

//           const src = article.englishSource?.toLowerCase();
//           const sourceInfo = sourceMap[src];

//           return sourceInfo ? (
//             <a href={sourceInfo.url} target="_blank" rel="noopener noreferrer">
//               {sourceInfo.name}
//             </a>
//           ) : (
//             language === "EN" ? article.englishSource : article.chineseSource
//           );
//         })()}
//       </p>

//       <h2 className="card-title">
//         {language === "EN" ? article.englishTitle : article.chineseTitle}
//       </h2>

//       <p>📅 <strong>{labels.date}:</strong> {language === "EN" ? article.englishDate : article.chineseDate}</p>
      
//       {article.lastScraped && (
//         <p>⏱️ <strong>{labels.lastScraped}: </strong> 
//           {new Date(article.lastScraped).toLocaleString(language === "EN" ? 'en-US' : 'zh-CN', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })}
//         </p>
//       )}
      
//       <a 
//         href={article.url} 
//         target="_blank" 
//         rel="noopener noreferrer"
//         className="card-link"
//       >
//         🔗 {labels.readMore}
//       </a>
//     </div>
//   );
// };

// export default ContentCard;


// src/components/ContentCard.js
import React, { useEffect } from 'react';
import './ContentCard.css';
import { translateText } from '../utils/translateText'; // ✅ Make sure this exists and works

const categoryTranslations = {
  'Investment': '投资',
  'Tourism': '旅游',
  'Regulations': '法规',
  'International Cooperation': '国际合作',
  'Major Infrastructure Projects': '重大基础设施项目'
};

const sourceMap = {
  mef: {
    en: { name: "Ministry of Economy and Finance", url: "https://mef.gov.kh/" },
    zh: { name: "经济与财政部", url: "https://mef.gov.kh/" }
  },
  tourism: {
    en: { name: "Ministry of Tourism", url: "https://tourism.gov.kh/category/news/" },
    zh: { name: "旅游部", url: "https://tourism.gov.kh/category/news/" }
  },
  khmertimes: {
    en: { name: "Khmer Times", url: "https://www.khmertimeskh.com/" },
    zh: { name: "高棉时报", url: "https://www.khmertimeskh.com/" }
  },
  ppp: {
    en: { name: "Phnom Penh Post", url: "https://www.phnompenhpost.com/" },
    zh: { name: "金边邮报", url: "https://www.phnompenhpost.com/" }
  },
  cdc: {
    en: { name: "Council for the Development of Cambodia", url: "https://cdc.gov.kh/" },
    zh: { name: "柬埔寨发展委员会", url: "https://cdc.gov.kh/" }
  },
  customs: {
    en: { name: "General Department of Customs and Excise of Cambodia", url: "https://www.customs.gov.kh/en/news-and-events?page=1" },
    zh: { name: "柬埔寨海关总署", url: "https://www.customs.gov.kh/en/news-and-events?page=1" }
  }
};

const ContentCard = ({ article, language }) => {
  const labels = {
    category: language === "EN" ? "Category" : "类别",
    source: language === "EN" ? "Source" : "来源",
    date: language === "EN" ? "Date" : "日期",
    readMore: language === "EN" ? "Read More" : "阅读更多",
    lastScraped: language === "EN" ? "Last Scraped" : "最后抓取时间"
  };

  const getSourceInfo = () => {
    const src = article.englishSource?.toLowerCase();
    const sourceInfo = sourceMap[src]?.[language === "EN" ? "en" : "zh"];

    return sourceInfo ? (
      <a href={sourceInfo.url} target="_blank" rel="noopener noreferrer">
        {sourceInfo.name}
      </a>
    ) : (
      language === "EN" ? article.englishSource : article.chineseSource
    );
  };

  const displayedTitle = language === "EN"
    ? article.englishTitle
    : article.chineseTitle || article.englishTitle;

  console.log("Displaying article title:", displayedTitle);

  // ✅ Move useEffect inside the component
  useEffect(() => {
    if (language === 'ZH') {
      translateText(article.englishTitle || article.englishTitle, 'zh').then((translated) => {
        console.log('Translated title:', translated);
        // optionally store or render this translated title
      });
    }
  }, [language, article]);

  return (
    <div className="card">
      <img
        src={article.link}
        alt={displayedTitle}
        className="card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/400x250?text=Image+Unavailable';
        }}
      />

      <p>🗂️ <strong>{labels.category}:</strong> {
        language === "EN"
          ? article.englishCategory
          : categoryTranslations[article.englishCategory] || article.chineseCategory || article.englishCategory
      }</p>

      <p>📍 <strong>{labels.source}:</strong> {getSourceInfo()}</p>

      <h2 className="card-title">{displayedTitle}</h2>

      <p>📅 <strong>{labels.date}:</strong> {
        language === "EN" ? article.englishDate : article.chineseDate
      }</p>

      {article.lastScraped && (
        <p>⏱️ <strong>{labels.lastScraped}:</strong> {
          new Date(article.lastScraped).toLocaleString(
            language === "EN" ? 'en-US' : 'zh-CN',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }
          )
        }</p>
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
