import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Save, Clock, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SavedTimer {
  id: string;
  name: string;
  duration: number;
}

export const CountdownTimer: React.FC = () => {
  const { t } = useTranslation();
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [savedTimers, setSavedTimers] = useState<SavedTimer[]>([]);
  const [timerName, setTimerName] = useState<string>('');
  const [showSaveForm, setShowSaveForm] = useState<boolean>(false);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem('savedTimers');
    if (saved) {
      setSavedTimers(JSON.parse(saved));
    }
    
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem('savedTimers', JSON.stringify(savedTimers));
  }, [savedTimers]);

  useEffect(() => {
    if (!isRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
    }
  }, [hours, minutes, seconds, isRunning]);

  const startTimer = () => {
    if (timeLeft === 0) return;
    
    setIsRunning(true);
    
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (audioRef.current) {
            audioRef.current.play();
          }
          window.clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    pauseTimer();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimeLeft(totalSeconds);
  };
  
  const saveTimer = () => {
    if (timerName.trim() === '') return;
    
    const newTimer: SavedTimer = {
      id: Date.now().toString(),
      name: timerName,
      duration: hours * 3600 + minutes * 60 + seconds
    };
    
    setSavedTimers([...savedTimers, newTimer]);
    setTimerName('');
    setShowSaveForm(false);
  };
  
  const loadTimer = (timer: SavedTimer) => {
    pauseTimer();
    
    const h = Math.floor(timer.duration / 3600);
    const m = Math.floor((timer.duration % 3600) / 60);
    const s = timer.duration % 60;
    
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setTimeLeft(timer.duration);
  };
  
  const deleteTimer = (id: string) => {
    setSavedTimers(savedTimers.filter(timer => timer.id !== id));
  };
  
  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const handleInputChange = (value: string, setter: (value: number) => void, max: number) => {
    let num = parseInt(value);
    
    if (isNaN(num)) {
      num = 0;
    }
    
    num = Math.max(0, Math.min(num, max));
    setter(num);
  };

  useEffect(() => {
    if (isRunning) {
      const h = Math.floor(timeLeft / 3600);
      const m = Math.floor((timeLeft % 3600) / 60);
      const s = timeLeft % 60;
      
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }
  }, [timeLeft, isRunning]);
  
  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('nav.countdown')}</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center text-5xl font-mono">
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => handleInputChange(e.target.value, setHours, 23)}
              className="w-20 bg-transparent text-center border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
              disabled={isRunning}
            />
            <span className="mx-1">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => handleInputChange(e.target.value, setMinutes, 59)}
              className="w-20 bg-transparent text-center border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
              disabled={isRunning}
            />
            <span className="mx-1">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
              className="w-20 bg-transparent text-center border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none"
              disabled={isRunning}
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className={`flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg transition-colors ${
                timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
              disabled={timeLeft === 0}
            >
              <Play size={18} />
              <span>{t('countdown.start')}</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center space-x-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Pause size={18} />
              <span>{t('countdown.pause')}</span>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="flex items-center space-x-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={18} />
            <span>{t('countdown.reset')}</span>
          </button>
          
          {!isRunning && (
            <button
              onClick={() => setShowSaveForm(true)}
              className={`flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
                timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={timeLeft === 0}
            >
              <Save size={18} />
              <span>{t('countdown.save')}</span>
            </button>
          )}
        </div>
        
        {showSaveForm && (
          <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center">
              <input
                type="text"
                value={timerName}
                onChange={(e) => setTimerName(e.target.value)}
                placeholder={t('countdown.enterTimerName')}
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded mr-2 bg-white dark:bg-gray-700"
              />
              <button
                onClick={saveTimer}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={timerName.trim() === ''}
              >
                {t('countdown.save')}
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="px-2 py-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {t('countdown.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {savedTimers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">{t('countdown.savedTimers')}</h3>
          
          <div className="space-y-2">
            {savedTimers.map((timer) => {
              const h = Math.floor(timer.duration / 3600);
              const m = Math.floor((timer.duration % 3600) / 60);
              const s = timer.duration % 60;
              
              return (
                <div 
                  key={timer.id} 
                  className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">{timer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {`${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadTimer(timer)}
                      className="p-1 text-blue-500 hover:text-blue-600"
                      aria-label="Load timer"
                    >
                      <Play size={18} />
                    </button>
                    <button
                      onClick={() => deleteTimer(timer.id)}
                      className="p-1 text-red-500 hover:text-red-600"
                      aria-label="Delete timer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};