import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
}

export const PomodoroTimer: React.FC = () => {
  const { t } = useTranslation();
  
  const defaultSettings: TimerSettings = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4
  };
  
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(settings.work * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [totalWorkTime, setTotalWorkTime] = useState<number>(0);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setTempSettings(parsed);
      setTimeLeft(parsed.work * 60);
    }
    
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
      const { cycles, totalWork } = JSON.parse(savedStats);
      setCyclesCompleted(cycles || 0);
      setTotalWorkTime(totalWork || 0);
    }
    
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);
  
  useEffect(() => {
    localStorage.setItem('pomodoroStats', JSON.stringify({
      cycles: cyclesCompleted,
      totalWork: totalWorkTime
    }));
  }, [cyclesCompleted, totalWorkTime]);
  
  useEffect(() => {
    if (mode === 'work') {
      setTimeLeft(settings.work * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.longBreak * 60);
    }
    
    pauseTimer();
  }, [mode, settings]);
  
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          
          if (audioRef.current) {
            audioRef.current.play();
          }
          
          if (mode === 'work') {
            setTotalWorkTime(prev => prev + settings.work * 60);
            
            const newCyclesCompleted = cyclesCompleted + 1;
            setCyclesCompleted(newCyclesCompleted);
            
            if (newCyclesCompleted % settings.cycles === 0) {
              setMode('longBreak');
            } else {
              setMode('shortBreak');
            }
          } else {
            setMode('work');
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    pauseTimer();
    
    if (mode === 'work') {
      setTimeLeft(settings.work * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.longBreak * 60);
    }
  };
  
  const saveSettings = () => {
    setSettings(tempSettings);
    setShowSettings(false);
  };
  
  const resetStats = () => {
    setCyclesCompleted(0);
    setTotalWorkTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours} ${t('pomodoro.stats.hours')} ${mins} ${t('pomodoro.stats.minutes')}`;
  };
  
  const calculateProgress = () => {
    let totalTime;
    
    if (mode === 'work') {
      totalTime = settings.work * 60;
    } else if (mode === 'shortBreak') {
      totalTime = settings.shortBreak * 60;
    } else {
      totalTime = settings.longBreak * 60;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  const progress = calculateProgress();
  
  const getBgColor = () => {
    if (mode === 'work') {
      return 'bg-red-500';
    } else if (mode === 'shortBreak') {
      return 'bg-green-500';
    } else {
      return 'bg-blue-500';
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-center py-12">
      <div className="relative bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-gray-300"
            aria-label={t('pomodoro.settings')}
          >
            <Settings size={20} />
          </button>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('work')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                mode === 'work' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t('pomodoro.work')}
            </button>
            <button
              onClick={() => setMode('shortBreak')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                mode === 'shortBreak' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t('pomodoro.shortBreak')}
            </button>
            <button
              onClick={() => setMode('longBreak')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                mode === 'longBreak' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t('pomodoro.longBreak')}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className={`h-4 rounded-full ${getBgColor()}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-6xl font-mono text-center mb-8 font-bold text-white">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play size={18} />
              <span>{t('pomodoro.start')}</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center space-x-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Pause size={18} />
              <span>{t('pomodoro.pause')}</span>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="flex items-center space-x-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={18} />
            <span>{t('pomodoro.reset')}</span>
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">
                {t('pomodoro.stats.completedCycles')}: <span className="font-bold">{cyclesCompleted}</span>
              </p>
              <p className="text-sm text-gray-400">
                {t('pomodoro.stats.totalWorkTime')}: <span className="font-bold">{formatTotalTime(totalWorkTime)}</span>
              </p>
            </div>
            <button
              onClick={resetStats}
              className="text-sm text-red-500 hover:text-red-600"
            >
              {t('pomodoro.stats.resetStats')}
            </button>
          </div>
        </div>
      </div>
      
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-white">{t('pomodoro.settings')}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-300">
                  {t('pomodoro.workDuration')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.work}
                  onChange={(e) => setTempSettings({...tempSettings, work: parseInt(e.target.value) || 25})}
                  className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-300">
                  {t('pomodoro.shortBreakDuration')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreak}
                  onChange={(e) => setTempSettings({...tempSettings, shortBreak: parseInt(e.target.value) || 5})}
                  className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-300">
                  {t('pomodoro.longBreakDuration')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreak}
                  onChange={(e) => setTempSettings({...tempSettings, longBreak: parseInt(e.target.value) || 15})}
                  className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-300">
                  {t('pomodoro.cyclesBeforeLongBreak')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempSettings.cycles}
                  onChange={(e) => setTempSettings({...tempSettings, cycles: parseInt(e.target.value) || 4})}
                  className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                {t('pomodoro.cancel')}
              </button>
              <button 
                onClick={saveSettings}
                className="px-6 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('pomodoro.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};