import React, { createContext, useContext, useState, useEffect } from 'react';

type TimeContextType = {
  currentTime: Date;
  timeZone: string;
  setTimeZone: (zone: string) => void;
};

const TimeContext = createContext<TimeContextType>({
  currentTime: new Date(),
  timeZone: 'Asia/Shanghai',
  setTimeZone: () => {},
});

export const useTime = () => useContext(TimeContext);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeZone, setTimeZone] = useState<string>('Asia/Shanghai');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <TimeContext.Provider value={{ currentTime, timeZone, setTimeZone }}>
      {children}
    </TimeContext.Provider>
  );
};