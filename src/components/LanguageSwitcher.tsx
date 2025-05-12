import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            i18n.language === lang.code 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};