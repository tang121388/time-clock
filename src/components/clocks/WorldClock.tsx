import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, X } from 'lucide-react';

interface TimeZone {
  id: string;
  name: string;
  offset: string;
  countryCode: string;
}

export const WorldClock: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>([
    { id: 'America/New_York', name: 'New York', offset: 'GMT-5', countryCode: 'US' },
    { id: 'Europe/London', name: 'London', offset: 'GMT+0', countryCode: 'GB' },
    { id: 'Asia/Dubai', name: 'Dubai', offset: 'GMT+4', countryCode: 'AE' },
    { id: 'Asia/Tokyo', name: 'Tokyo', offset: 'GMT+9', countryCode: 'JP' },
    { id: 'Asia/Shanghai', name: 'Beijing', offset: 'GMT+8', countryCode: 'CN' },
    { id: 'Europe/Paris', name: 'Paris', offset: 'GMT+1', countryCode: 'FR' }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<TimeZone | null>(null);
  
  const availableTimeZones: TimeZone[] = [
    { id: 'Europe/Berlin', name: 'Berlin', offset: 'GMT+1', countryCode: 'DE' },
    { id: 'Asia/Singapore', name: 'Singapore', offset: 'GMT+8', countryCode: 'SG' },
    { id: 'Australia/Sydney', name: 'Sydney', offset: 'GMT+10', countryCode: 'AU' },
    { id: 'Pacific/Auckland', name: 'Auckland', offset: 'GMT+12', countryCode: 'NZ' },
    { id: 'Asia/Seoul', name: 'Seoul', offset: 'GMT+9', countryCode: 'KR' },
    { id: 'Europe/Moscow', name: 'Moscow', offset: 'GMT+3', countryCode: 'RU' },
    { id: 'Asia/Hong_Kong', name: 'Hong Kong', offset: 'GMT+8', countryCode: 'HK' },
    { id: 'Europe/Rome', name: 'Rome', offset: 'GMT+1', countryCode: 'IT' },
    { id: 'America/Los_Angeles', name: 'Los Angeles', offset: 'GMT-8', countryCode: 'US' },
    { id: 'America/Chicago', name: 'Chicago', offset: 'GMT-6', countryCode: 'US' },
    { id: 'America/Toronto', name: 'Toronto', offset: 'GMT-5', countryCode: 'CA' },
    { id: 'America/Sao_Paulo', name: 'São Paulo', offset: 'GMT-3', countryCode: 'BR' }
  ];
  
  const getTimeInTimeZone = (timeZoneId: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timeZoneId
    };
    
    return new Date().toLocaleTimeString('en-US', options);
  };
  
  const getDateInTimeZone = (timeZoneId: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timeZoneId
    };
    
    return new Date().toLocaleDateString('en-US', options);
  };
  
  const addTimeZone = () => {
    if (selectedCity && !selectedTimeZones.some(tz => tz.id === selectedCity.id)) {
      setSelectedTimeZones([...selectedTimeZones, selectedCity]);
    }
    setShowAddModal(false);
    setSelectedCity(null);
  };
  
  const removeTimeZone = (id: string) => {
    setSelectedTimeZones(selectedTimeZones.filter(tz => tz.id !== id));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedTimeZones(zones => [...zones]);
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto min-h-[60vh] flex flex-col justify-center py-12">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-white">World Clock</h2>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {selectedTimeZones.map((timeZone) => (
            <div 
              key={timeZone.id} 
              className="relative bg-gray-700 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
            >
              <button 
                onClick={() => removeTimeZone(timeZone.id)}
                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove city"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center mb-4">
                <img
                  src={`https://flagcdn.com/w40/${timeZone.countryCode.toLowerCase()}.png`}
                  alt={`${timeZone.name} flag`}
                  className="w-8 h-6 mr-3 rounded shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{timeZone.name}</h3>
                  <p className="text-sm text-gray-400">{timeZone.offset}</p>
                </div>
              </div>
              
              <p className="text-4xl font-mono font-bold mb-2 text-white">{getTimeInTimeZone(timeZone.id)}</p>
              <p className="text-sm text-gray-400">{getDateInTimeZone(timeZone.id)}</p>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Globe size={20} />
          <span>Add City</span>
        </button>
        
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Add City</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <select 
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCity?.id || ''}
                  onChange={(e) => {
                    const selected = availableTimeZones.find(tz => tz.id === e.target.value);
                    setSelectedCity(selected || null);
                  }}
                >
                  <option value="">Select a city</option>
                  {availableTimeZones
                    .filter(tz => !selectedTimeZones.some(selected => selected.id === tz.id))
                    .map((tz) => (
                      <option key={tz.id} value={tz.id}>
                        {tz.name} ({tz.offset})
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={addTimeZone}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={!selectedCity}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};