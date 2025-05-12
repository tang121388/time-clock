import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface Lap {
  id: number;
  time: number;
  total: number;
}

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lapCounterRef = useRef<number>(0);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const startStopwatch = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now() - time;
    
    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  };
  
  const pauseStopwatch = () => {
    if (!isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };
  
  const resetStopwatch = () => {
    pauseStopwatch();
    setTime(0);
    setLaps([]);
    lapCounterRef.current = 0;
  };
  
  const addLap = () => {
    if (!isRunning) return;
    
    const lastLapTime = laps.length > 0 ? laps[0].total : 0;
    const lapTime = time - lastLapTime;
    
    lapCounterRef.current += 1;
    
    setLaps(prevLaps => [
      {
        id: lapCounterRef.current,
        time: lapTime,
        total: time
      },
      ...prevLaps
    ]);
  };
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  const getBestLap = () => {
    if (laps.length <= 1) return null;
    
    let bestLapId = laps[0].id;
    let bestLapTime = laps[0].time;
    
    for (let i = 1; i < laps.length; i++) {
      if (laps[i].time < bestLapTime) {
        bestLapTime = laps[i].time;
        bestLapId = laps[i].id;
      }
    }
    
    return bestLapId;
  };
  
  const getWorstLap = () => {
    if (laps.length <= 1) return null;
    
    let worstLapId = laps[0].id;
    let worstLapTime = laps[0].time;
    
    for (let i = 1; i < laps.length; i++) {
      if (laps[i].time > worstLapTime) {
        worstLapTime = laps[i].time;
        worstLapId = laps[i].id;
      }
    }
    
    return worstLapId;
  };
  
  const bestLapId = getBestLap();
  const worstLapId = getWorstLap();
  
  return (
    <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-center py-12">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <div className="text-[8rem] font-mono text-center mb-8 font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          {!isRunning ? (
            <button
              onClick={startStopwatch}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              <Play size={24} />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={pauseStopwatch}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              <Pause size={24} />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={resetStopwatch}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
          >
            <RotateCcw size={24} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={addLap}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
            disabled={!isRunning}
          >
            <Flag size={24} />
            <span>Lap</span>
          </button>
        </div>
        
        {laps.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-white">Laps</h3>
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-700">
                    <th className="py-3 text-left text-lg text-gray-300">Lap</th>
                    <th className="py-3 text-left text-lg text-gray-300">Split Time</th>
                    <th className="py-3 text-left text-lg text-gray-300">Total Time</th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((lap) => (
                    <tr 
                      key={lap.id} 
                      className={`border-b border-gray-700 ${
                        lap.id === bestLapId ? 'text-green-500' : 
                        lap.id === worstLapId ? 'text-red-500' : 'text-gray-300'
                      }`}
                    >
                      <td className="py-3 text-lg">{lap.id}</td>
                      <td className="py-3 font-mono text-lg">{formatTime(lap.time)}</td>
                      <td className="py-3 font-mono text-lg">{formatTime(lap.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};