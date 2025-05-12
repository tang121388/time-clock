import React from 'react';
import { Clock, StopCircle, Focus, Globe, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type TabType = 'clock' | 'stopwatch' | 'pomodoro' | 'world' | 'alarm';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'clock', label: t('nav.clock'), icon: <Clock size={24} /> },
    { id: 'alarm', label: t('nav.alarm'), icon: <Bell size={24} /> },
    { id: 'stopwatch', label: t('nav.stopwatch'), icon: <StopCircle size={24} /> },
    { id: 'pomodoro', label: t('nav.pomodoro'), icon: <Focus size={24} /> },
    { id: 'world', label: t('nav.world'), icon: <Globe size={24} /> }
  ];

  return (
    <header className="sticky top-0 bg-gray-800 shadow-lg z-10">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center px-8 py-4 border-b-2 transition-colors ${
                activeTab === item.id
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-gray-400 hover:text-blue-400 font-semibold'
              }`}
            >
              {item.icon}
              <span className="mt-1 text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};