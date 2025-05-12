import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { DigitalClock } from './clocks/DigitalClock';
import { AnalogClock } from './clocks/AnalogClock';
import { Stopwatch } from './timers/Stopwatch';
import { PomodoroTimer } from './timers/PomodoroTimer';
import { WorldClock } from './clocks/WorldClock';
import { AlarmClock } from './clocks/AlarmClock';
import { Footer } from './Footer';

type TabType = 'clock' | 'stopwatch' | 'pomodoro' | 'world' | 'alarm';

export const Layout: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('clock');
  const [clockType, setClockType] = useState<'digital' | 'analog'>('digital');

  const renderFeatureContent = () => {
    switch (activeTab) {
      case 'clock':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {clockType === 'digital' ? <DigitalClock /> : <AnalogClock />}
          </div>
        );
      case 'alarm':
        return <AlarmClock />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'world':
        return <WorldClock />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        {/* Feature Section */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'clock' && (
            <div className="flex space-x-4 mb-8 justify-center">
              <button 
                onClick={() => setClockType('digital')}
                className={`px-6 py-2 rounded-lg text-lg font-semibold transition-colors ${
                  clockType === 'digital' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {t('clock.digital')}
              </button>
              <button 
                onClick={() => setClockType('analog')}
                className={`px-6 py-2 rounded-lg text-lg font-semibold transition-colors ${
                  clockType === 'analog' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {t('clock.analog')}
              </button>
            </div>
          )}
          
          <div className="mb-16">
            {renderFeatureContent()}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-gray-800 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-8">{t('app.title')}</h1>
            
            <div className="max-w-4xl mx-auto prose prose-invert">
              <p className="lead text-xl text-gray-300 mb-8 text-center">
                Your comprehensive time management solution featuring multiple tools to help you stay organized and productive.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="feature-card p-6 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold mb-3">Time Display</h3>
                  <p className="text-gray-300">Accurate digital and analog clocks with customizable display options. Switch between 12/24-hour formats and toggle seconds visibility.</p>
                </div>

                <div className="feature-card p-6 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold mb-3">Alarm Clock</h3>
                  <p className="text-gray-300">Set multiple alarms with custom labels and repeat options. Perfect for wake-up calls, reminders, and time-sensitive tasks.</p>
                </div>

                <div className="feature-card p-6 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold mb-3">World Clock</h3>
                  <p className="text-gray-300">Track time across multiple time zones instantly. Ideal for international business, global teams, and staying connected worldwide.</p>
                </div>

                <div className="feature-card p-6 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold mb-3">Stopwatch & Timer</h3>
                  <p className="text-gray-300">High-precision stopwatch with lap timing and a customizable countdown timer for various timing needs.</p>
                </div>

                <div className="feature-card p-6 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold mb-3">Focus Timer</h3>
                  <p className="text-gray-300">Boost productivity with our Pomodoro timer. Customize work/break intervals and track your progress.</p>
                </div>

                <div className="feature-card p-6 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold mb-3">User Experience</h3>
                  <p className="text-gray-300">Clean, intuitive interface with dark mode support and responsive design for all devices.</p>
                </div>
              </div>

              <div className="bg-blue-900/20 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-4">Why Choose Smart Clock?</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ All-in-one time management solution</li>
                  <li>✓ No installation required - works in your browser</li>
                  <li>✓ Free to use with no ads</li>
                  <li>✓ Works offline</li>
                  <li>✓ Regular updates and new features</li>
                </ul>
              </div>

              <div className="text-center text-gray-400">
                <p>Start managing your time more effectively with Smart Clock today.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};