import React, { useState, useEffect, useRef } from 'react';
import { Bell, Plus, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  days: string[];
  label: string;
}

export const AlarmClock: React.FC = () => {
  const { t } = useTranslation();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [newAlarmDays, setNewAlarmDays] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const daysOfWeek = [
    { key: 'sun', label: 'Sun' },
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' }
  ];

  useEffect(() => {
    const savedAlarms = localStorage.getItem('alarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
    
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
  }, []);

  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

      alarms.forEach(alarm => {
        if (
          alarm.enabled && 
          alarm.time === currentTime &&
          (alarm.days.length === 0 || alarm.days.includes(currentDay))
        ) {
          triggerAlarm(alarm);
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const triggerAlarm = (alarm: Alarm) => {
    if (audioRef.current) {
      audioRef.current.play();
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Alarm', {
          body: alarm.label || 'Time to wake up!',
          icon: '/icon-192.png'
        });
      }
    }
  };

  const addAlarm = () => {
    if (!newAlarmTime) return;

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      enabled: true,
      days: newAlarmDays,
      label: newAlarmLabel
    };

    setAlarms([...alarms, newAlarm]);
    setShowAddModal(false);
    setNewAlarmTime('');
    setNewAlarmLabel('');
    setNewAlarmDays([]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const toggleDay = (day: string) => {
    if (newAlarmDays.includes(day)) {
      setNewAlarmDays(newAlarmDays.filter(d => d !== day));
    } else {
      setNewAlarmDays([...newAlarmDays, day]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-center py-12">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Alarm Clock
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
          >
            <Plus size={24} />
            <span>Add Alarm</span>
          </button>
        </div>

        <div className="space-y-6">
          {alarms.map(alarm => (
            <div
              key={alarm.id}
              className="bg-gray-700 rounded-xl shadow-md p-6 flex items-center justify-between transition-all hover:shadow-lg"
            >
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`p-3 rounded-full transition-colors ${
                    alarm.enabled
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {alarm.enabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
                <div>
                  <p className="text-3xl font-mono font-bold text-white">
                    {alarm.time}
                  </p>
                  {alarm.label && (
                    <p className="text-base text-gray-300 mt-1">{alarm.label}</p>
                  )}
                  {alarm.days.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {alarm.days.map(day => (
                        <span key={day} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                          {day}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteAlarm(alarm.id)}
                className="p-3 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}

          {alarms.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Bell size={64} className="mx-auto mb-6 opacity-50" />
              <p className="text-xl">No alarms set. Click "Add Alarm" to create one.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-white">Add New Alarm</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2 text-gray-300">Time</label>
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2 text-gray-300">Label (optional)</label>
                <input
                  type="text"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  placeholder="Enter alarm label"
                  className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-gray-300">Repeat</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map(day => (
                    <button
                      key={day.key}
                      onClick={() => toggleDay(day.key)}
                      className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                        newAlarmDays.includes(day.key)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 text-lg bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAlarm}
                className="px-6 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!newAlarmTime}
              >
                Add Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};