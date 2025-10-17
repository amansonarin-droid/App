import React from 'react';
import { GemIcon, CalculatorIcon, BookIcon, AiChipIcon } from './icons';

interface SplashScreenProps {
  isExiting: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isExiting }) => {
  const orbitingIcons = [
    { Icon: CalculatorIcon, delay: '0.5s', position: 0 },
    { Icon: AiChipIcon, delay: '0.8s', position: 120 },
    { Icon: BookIcon, delay: '1.1s', position: 240 },
  ];

  return (
    <div className={`fixed inset-0 bg-slate-900 flex flex-col justify-center items-center z-50 transition-opacity duration-500 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="splash-container">
        <GemIcon className="h-24 w-24 text-gold-400 central-gem-animation" />
        {orbitingIcons.map(({ Icon, delay, position }) => (
          <div
            key={position}
            className="orbiting-icon"
            style={{
              animationDelay: delay,
              transform: `rotate(${position}deg) translateX(120px) rotate(-${position}deg) scale(0)`,
            }}
          >
            <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-gold-500/20">
              <Icon className="h-6 w-6 text-gold-500/80" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <h1 
          className="text-5xl font-bold text-gold-400 tracking-wider"
          style={{ animation: 'fadeIn-text 1.5s ease-out 1.5s forwards', opacity: 0 }}
        >
          FinGold
        </h1>
        <p 
          className="text-slate-400 mt-2"
          style={{ animation: 'fadeIn-text 1.5s ease-out 1.8s forwards', opacity: 0 }}
        >
          AI-Powered Financial Toolkit for Jewelers
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;