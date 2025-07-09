// // src/components/ContentList.js
// import React, { useEffect, useState } from 'react';
// import ContentCard from './ContentCard';
// import FilterBar from './FilterBar';
// import './ContentList.css';
// import { translateText } from '../utils/translateText';
// import combinedPressReleases from '../data/combined_press_releases.json';
// import Header from './Header';

// const ContentList = () => {
//   const [articles, setArticles] = useState([]);
//   const [category, setCategory] = useState("Investment");
//   const [language, setLanguage] = useState("EN");
//   const [currentPage, setCurrentPage] = useState(1);
//   const articlesPerPage = 9;

//   useEffect(() => {
//     const loadArticles = async () => {
//       try {
//         // Use the imported JSON data directly
//         const data = combinedPressReleases;
        
//         const translatedArticles = await Promise.all(
//           data.map(async (article) => {
//             const summary = article.description ? article.description.slice(0, 60) : '';
//             const titleTranslated = article.title ? await translateText(article.title, 'zh') : '';
//             const summaryTranslated = summary ? await translateText(summary, 'zh') : '';
//             const categoryTranslated = article.category ? await translateText(article.category, 'zh') : '';
//             const sourceTranslated = article.source ? await translateText(article.source, 'zh') : '';
//             const dateTranslated = article.Date || article.date
//               ? await translateText(article.Date || article.date, 'zh')
//               : '';
        
//             return {
//               ...article,
//               englishSummary: summary + "...",
//               chineseSummary: summaryTranslated,
//               englishTitle: article.title,
//               chineseTitle: titleTranslated,
//               englishCategory: article.category,
//               chineseCategory: categoryTranslated,
//               englishSource: article.source,
//               chineseSource: sourceTranslated,
//               englishDate: article.Date || article.date,
//               chineseDate: dateTranslated,
//               lastScraped: article.LastScraped || new Date().toISOString(),
//             };
//           })
//         );
        
//         setArticles(translatedArticles);
//       } catch (error) {
//         console.error("Error processing articles:", error);
//       }
//     };

//     loadArticles();
//   }, []);

//   // 🧪 Filter articles
//   const filteredArticles = category === "All"
//     ? articles
//     : articles.filter(article => article.category === category);

//   const indexOfLast = currentPage * articlesPerPage;
//   const indexOfFirst = indexOfLast - articlesPerPage;
//   const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

//   const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
//   const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

//   return (
//     <div>

//       <Header language={language} />

//       <FilterBar
//         category={category}
//         setCategory={setCategory}
//         language={language}
//         setLanguage={setLanguage}
//       />

//       <section className="grid">
//         {currentArticles.map((article, index) => (
//           <ContentCard key={index} article={article} language={language} />
//         ))}
//       </section>

//       <div className="pagination">
//         <button onClick={handlePrev} disabled={currentPage === 1}>◀ Prev</button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button onClick={handleNext} disabled={currentPage === totalPages}>Next ▶</button>
//       </div>
//     </div>
//   );
// };

// export default ContentList;

// import React, { useEffect, useState, useMemo } from 'react';
// import ContentCard from './ContentCard';
// import FilterBar from './FilterBar';
// import './ContentList.css';
// import { translateBatch } from '../utils/translateText';
// import combinedPressReleases from '../data/combined_press_releases.json';
// import Header from './Header';

// const ContentList = () => {
//   const [articles, setArticles] = useState([]);
//   const [category, setCategory] = useState("Investment");
//   const [language, setLanguage] = useState("EN");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const articlesPerPage = 9;

//   useEffect(() => {
//     const loadArticles = async () => {
//       try {
//         setIsLoading(true);
//         const data = combinedPressReleases;
        
//         // Prepare all texts that need translation
//         const textsToTranslate = data.flatMap(article => [
//           article.title,
//           article.description?.slice(0, 60),
//           article.category,
//           article.source,
//           article.Date || article.date
//         ].filter(Boolean));

//         // Batch translate all texts at once
//         const translatedTexts = await translateBatch(textsToTranslate, 'zh');
//         let translationIndex = 0;

//         const processedArticles = data.map(article => {
//           const getNextTranslation = () => translatedTexts[translationIndex++];
          
//           return {
//             ...article,
//             englishSummary: article.description ? article.description.slice(0, 60) + "..." : '',
//             chineseSummary: article.description ? getNextTranslation() : '',
//             englishTitle: article.title,
//             chineseTitle: article.title ? getNextTranslation() : '',
//             englishCategory: article.category,
//             chineseCategory: article.category ? getNextTranslation() : '',
//             englishSource: article.source,
//             chineseSource: article.source ? getNextTranslation() : '',
//             englishDate: article.Date || article.date,
//             chineseDate: (article.Date || article.date) ? getNextTranslation() : '',
//             lastScraped: article.LastScraped || new Date().toISOString(),
//           };
//         });

//         setArticles(processedArticles);
//       } catch (error) {
//         console.error("Error processing articles:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadArticles();
//   }, []);

//   const filteredArticles = useMemo(() => (
//     category === "All" 
//       ? articles 
//       : articles.filter(article => article.category === category)
//   ), [articles, category]);

//   const indexOfLast = currentPage * articlesPerPage;
//   const indexOfFirst = indexOfLast - articlesPerPage;
//   const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

//   const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
//   const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

//   return (
//     <div>
//       <Header language={language} setLanguage={setLanguage} />

//       <FilterBar
//         category={category}
//         setCategory={setCategory}
//         language={language}
//         setLanguage={setLanguage}
//       />

//       {isLoading ? (
//         <div className="loading-message">Loading articles...</div>
//       ) : (
//         <>
//           <section className="grid">
//             {currentArticles.map((article, index) => (
//               <ContentCard 
//                 key={`${article.id || index}`} 
//                 article={article} 
//                 language={language} 
//               />
//             ))}
//           </section>

//           <div className="pagination">
//             <button onClick={handlePrev} disabled={currentPage === 1}>
//               ◀ {language === "EN" ? "Prev" : "上一页"}
//             </button>
//             <span>
//               {language === "EN" ? "Page" : "页"} {currentPage} {language === "EN" ? "of" : "/"} {totalPages}
//             </span>
//             <button onClick={handleNext} disabled={currentPage === totalPages}>
//               {language === "EN" ? "Next" : "下一页"} ▶
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ContentList;


// src/components/ContentList.js
import React, { useEffect, useState, useMemo } from 'react';
import ContentCard from './ContentCard';
import FilterBar from './FilterBar';
import './ContentList.css';
import { translateBatch} from '../utils/translateText';
import combinedPressReleases from '../data/combined_press_releases.json';
import Header from './Header';

const ContentList = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("Investment");
  const [language, setLanguage] = useState("EN");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const articlesPerPage = 9;

  // Load initial articles
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const data = combinedPressReleases;
        
        const processedArticles = data.map(article => ({
          ...article,
          englishSummary: article.description ? article.description.slice(0, 60) + "..." : '',
          englishTitle: article.title || '',
          englishCategory: article.category || '',
          englishSource: article.source || '',
          englishDate: article.Date || article.date || '',
          lastScraped: article.LastScraped || new Date().toISOString(),
          // Initialize Chinese fields as empty, will translate on demand
          chineseTitle: '',
          chineseSummary: '',
          chineseCategory: '',
          chineseSource: '',
          chineseDate: ''
        }));

        setArticles(processedArticles);
      } catch (error) {
        // console.error("Error loading articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Translate articles when language changes to Chinese
  useEffect(() => {
    if (language === 'ZH' && articles.length > 0) {
      const translateArticles = async () => {
        try {
          setIsTranslating(true);
          
          // Get all texts that need translation
          const textsToTranslate = articles.flatMap(article => [
            article.englishTitle,
            article.englishSummary,
            article.englishCategory,
            article.englishSource,
            article.englishDate
          ].filter(Boolean));

          // Batch translate all texts
          const translatedTexts = await translateBatch(textsToTranslate, 'zh');
          let translationIndex = 0;

          // Update articles with translations
          const updatedArticles = articles.map(article => {
            const getNextTranslation = () => {
              if (translationIndex < translatedTexts.length) {
                return translatedTexts[translationIndex++];
              }
              return '';
            };

            return {
              ...article,
              chineseTitle: article.englishTitle ? getNextTranslation() : '',
              chineseSummary: article.englishSummary ? getNextTranslation() : '',
              chineseCategory: article.englishCategory ? getNextTranslation() : '',
              chineseSource: article.englishSource ? getNextTranslation() : '',
              chineseDate: article.englishDate ? getNextTranslation() : ''
            };
          });

          setArticles(updatedArticles);
        } catch (error) {
          // console.error("Error translating articles:", error);
        } finally {
          setIsTranslating(false);
        }
      };

      // Only translate if we haven't already translated these articles
      if (articles.some(article => !article.chineseTitle)) {
        translateArticles();
      }
    }
  }, [language, articles]);

  const filteredArticles = useMemo(() => (
    category === "All" 
      ? articles 
      : articles.filter(article => article.category === category)
  ), [articles, category]);

  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div>
      <Header language={language} setLanguage={setLanguage} />

      <FilterBar
        category={category}
        setCategory={setCategory}
        language={language}
        setLanguage={setLanguage}
      />

      {(isLoading || isTranslating) ? (
        <div className="loading-message">
          {isLoading ? "Loading articles..." : "Translating articles..."}
        </div>
      ) : (
        <>
          <section className="grid">
            {currentArticles.map((article, index) => (
              <ContentCard 
                key={`${article.id || index}`} 
                article={article} 
                language={language} 
              />
            ))}
          </section>

          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ◀ {language === "EN" ? "Prev" : "上一页"}
            </button>
            <span>
              {language === "EN" ? "Page" : "页"} {currentPage} {language === "EN" ? "of" : "/"} {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              {language === "EN" ? "Next" : "下一页"} ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentList;