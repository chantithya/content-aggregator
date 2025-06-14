import React, { useEffect, useState } from 'react';
import { translateText } from '../utils/translateText';

const Header = ({ language }) => {
  const [translatedTitle, setTranslatedTitle] = useState('Cambodian Government Announcements');

  useEffect(() => {
    const translate = async () => {
      if (language === 'ZH') {
        const translated = await translateText('Cambodian Government Announcements', 'zh');
        setTranslatedTitle(translated);
      } else {
        setTranslatedTitle('Cambodian Government Announcements');
      }
    };
    translate();
  }, [language]);

  return (
    <header>
      <h1>{translatedTitle}</h1>
    </header>
  );
};

export default Header;
