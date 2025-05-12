import React, { useRef, useEffect } from 'react';
import { useTime } from '../../context/TimeContext';

export const AnalogClock: React.FC = () => {
  const { currentTime } = useTime();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkMode = document.body.classList.contains('dark');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawClock = () => {
      const width = canvas.width;
      const height = canvas.height;
      const radius = Math.min(width, height) / 2 * 0.9;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw the clock face
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isDarkMode ? '#2D3748' : '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = isDarkMode ? '#1A202C' : '#E2E8F0';
      ctx.stroke();
      
      // Draw clock center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      
      // Draw hour markers
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const innerRadius = radius * 0.9;
        const outerRadius = radius;
        
        const startX = centerX + innerRadius * Math.sin(angle);
        const startY = centerY - innerRadius * Math.cos(angle);
        const endX = centerX + outerRadius * Math.sin(angle);
        const endY = centerY - outerRadius * Math.cos(angle);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = isDarkMode ? '#CBD5E0' : '#4A5568';
        ctx.stroke();
      }
      
      // Get current time values
      const hours = currentTime.getHours() % 12;
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      
      // Draw hour hand
      const hourAngle = (hours * 30 + minutes / 2) * Math.PI / 180;
      const hourHandLength = radius * 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + hourHandLength * Math.sin(hourAngle),
        centerY - hourHandLength * Math.cos(hourAngle)
      );
      ctx.lineWidth = 6;
      ctx.strokeStyle = isDarkMode ? '#A0AEC0' : '#2D3748';
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw minute hand
      const minuteAngle = minutes * 6 * Math.PI / 180;
      const minuteHandLength = radius * 0.7;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + minuteHandLength * Math.sin(minuteAngle),
        centerY - minuteHandLength * Math.cos(minuteAngle)
      );
      ctx.lineWidth = 4;
      ctx.strokeStyle = isDarkMode ? '#A0AEC0' : '#2D3748';
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw second hand
      const secondAngle = seconds * 6 * Math.PI / 180;
      const secondHandLength = radius * 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + secondHandLength * Math.sin(secondAngle),
        centerY - secondHandLength * Math.cos(secondAngle)
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#EF4444';
      ctx.lineCap = 'round';
      ctx.stroke();
    };
    
    drawClock();
    
    // Clean up
    return () => {
      // Nothing to clean up
    };
  }, [currentTime, isDarkMode]);
  
  return (
    <div className="relative flex justify-center items-center p-4">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className="shadow-lg rounded-full"
      />
    </div>
  );
};