import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language === 'zh' ? '中文' : 'English';

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLanguage}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-36 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => changeLanguage('en')}
              >
                English
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => changeLanguage('zh')}
              >
                中文
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;