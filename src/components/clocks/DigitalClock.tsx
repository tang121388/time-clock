import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTime } from '../../context/TimeContext';

export const DigitalClock: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentTime } = useTime();
  const [showSeconds, setShowSeconds] = useState(true);
  const [is24Hour, setIs24Hour] = useState(true);
  
  const formatTime = () => {
    const hours = is24Hour 
      ? currentTime.getHours().toString().padStart(2, '0')
      : (currentTime.getHours() % 12 || 12).toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
    
    return {
      hours,
      minutes,
      seconds,
      ampm
    };
  };

  const { hours, minutes, seconds, ampm } = formatTime();
  
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return currentTime.toLocaleDateString(i18n.language, options);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-[10rem] font-bold tracking-tighter mb-6 flex items-center">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">{hours}</span>
        <span className="mx-4 text-blue-500">:</span>
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">{minutes}</span>
        {showSeconds && (
          <>
            <span className="mx-4 text-blue-500">:</span>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">{seconds}</span>
          </>
        )}
        {!is24Hour && <span className="ml-6 text-4xl self-start mt-8 text-blue-500">{ampm}</span>}
      </div>
      
      <div className="text-2xl text-gray-400 mb-8">
        {formatDate()}
      </div>
      
      <div className="flex space-x-4">
        <button 
          onClick={() => setShowSeconds(!showSeconds)}
          className="px-4 py-2 text-base rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {showSeconds ? t('clock.hideSeconds') : t('clock.showSeconds')}
        </button>
        <button 
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-4 py-2 text-base rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {is24Hour ? t('clock.hour12') : t('clock.hour24')}
        </button>
      </div>
    </div>
  );
};