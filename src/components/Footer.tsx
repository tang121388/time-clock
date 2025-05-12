import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © {currentYear} {t('app.title')}. {t('footer.rights')}
            </p>
          </div>
          <div>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  {t('footer.about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};