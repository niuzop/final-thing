import React, { useState, useRef, useEffect } from 'react';
import Cake from '../Cake';
import textConfig from '../textConfig';
// Add this import for the birthday wish GIF
import BirthdayWishGif from '../imgs/happybday.gif';

interface CakeCuttingProps {
  onNext: () => void;
}

const CakeCutting: React.FC<CakeCuttingProps> = ({ onNext }) => {
  const [step, setStep] = useState<'cutting' | 'wish'>('cutting');
  const [cutProgress, setCutProgress] = useState(0);
  const [isFullyCut, setIsFullyCut] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; message: string }[]>([]);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);
  const [isWishMade, setIsWishMade] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cutPath, setCutPath] = useState<{ x: number; y: number }[]>([]);
  const cakeContainerRef = useRef<HTMLDivElement>(null);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (step !== 'cutting' || isFullyCut) return;
    
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is in the cutting zone (middle area of cake)
    const cakeHeight = rect.height;
    const cutZoneTop = cakeHeight * 0.35;
    const cutZoneBottom = cakeHeight * 0.55;
    
    if (y >= cutZoneTop && y <= cutZoneBottom) {
      setIsDragging(true);
      setCutPath([{ x, y }]);
      setCutProgress(0);
      addCuttingSparkle(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || step !== 'cutting' || isFullyCut) return;
    
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add point to path
    setCutPath(prev => [...prev, { x, y }]);
    
    // Calculate progress based on horizontal distance covered
    const minX = Math.min(...cutPath.map(p => p.x), x);
    const maxX = Math.max(...cutPath.map(p => p.x), x);
    const progress = (maxX - minX) / rect.width;
    
    setCutProgress(Math.min(progress, 1));
    addCuttingSparkle(x, y);
    
    // Complete cutting when we've covered enough width
    if (progress > 0.75) {
      completeCutting();
    }
  };

  const handleMouseUp = () => {
    if (isDragging && cutProgress < 0.75) {
      // Reset if cut wasn't complete
      setTimeout(() => {
        setIsDragging(false);
        setCutPath([]);
        setCutProgress(0);
      }, 1000);
    } else {
      setIsDragging(false);
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (step !== 'cutting' || isFullyCut) return;
    
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;

    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    const cakeHeight = rect.height;
    const cutZoneTop = cakeHeight * 0.35;
    const cutZoneBottom = cakeHeight * 0.55;
    
    if (y >= cutZoneTop && y <= cutZoneBottom) {
      setIsDragging(true);
      setCutPath([{ x, y }]);
      setCutProgress(0);
      addCuttingSparkle(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging || step !== 'cutting' || isFullyCut || !e.touches[0]) return;
    
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    setCutPath(prev => [...prev, { x, y }]);
    
    const minX = Math.min(...cutPath.map(p => p.x), x);
    const maxX = Math.max(...cutPath.map(p => p.x), x);
    const progress = (maxX - minX) / rect.width;
    
    setCutProgress(Math.min(progress, 1));
    addCuttingSparkle(x, y);
    
    if (progress > 0.75) {
      completeCutting();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging && cutProgress < 0.75) {
      setTimeout(() => {
        setIsDragging(false);
        setCutPath([]);
        setCutProgress(0);
      }, 1000);
    } else {
      setIsDragging(false);
    }
  };

  // Add sparkles during cutting
  const addCuttingSparkle = (x: number, y: number) => {
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newSparkle = {
      id: Date.now() + Math.random(),
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      message: ['✨', '🌟', '💫'][Math.floor(Math.random() * 3)]
    };
    
    setSparkles(prev => [...prev.slice(-8), newSparkle]);
  };

  // Complete the cake cutting
  const completeCutting = () => {
    setIsDragging(false);
    setIsFullyCut(true);
    
    // Clear any existing sparkles first
    setSparkles([]);
    
    // Add celebration confetti for cake cutting completion
    const celebrationConfetti = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10,
      color: ['#ff6b9d', '#c44569', '#f8b500', '#ff3838', '#70a1ff'][Math.floor(Math.random() * 5)],
      size: 4 + Math.random() * 6
    }));
    
    setConfetti(celebrationConfetti);
    
    // Move to wish step after celebration
    setTimeout(() => {
      setConfetti([]);
      setStep('wish');
    }, 2000);
  };

  // Handle wish making - simple version without kisses
  const makeWish = () => {
    setIsWishMade(true);
    
    // Add final confetti
    const celebrationConfetti = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10,
      color: ['#ff6b9d', '#c44569', '#f8b500', '#ff3838', '#70a1ff', '#5352ed', '#ffd700', '#ff69b4'][Math.floor(Math.random() * 8)],
      size: 6 + Math.random() * 8
    }));
    
    setConfetti(celebrationConfetti);

    // Wait 2 seconds to let animation complete before proceeding
    setTimeout(() => {
      onNext();
    }, 2000);

    // Remove confetti after animation
    setTimeout(() => {
      setConfetti([]);
      setSparkles([]);
    }, 4000);
  };

  // Clear sparkles periodically to prevent memory buildup
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => prev.slice(-10));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 overflow-hidden">
      
      {/* Floating birthday icons */}
      <svg
        className="absolute top-12 left-8 w-8 h-8 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#FFF7A1"
        />
      </svg>

      <div className="absolute right-10 top-16 animate-birthday-float">
        <div className="text-2xl">🎈</div>
      </div>

      <div className="absolute left-12 bottom-24 animate-birthday-float" style={{ animationDelay: '1s' }}>
        <div className="text-2xl">🎉</div>
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {confetti.map((conf) => (
          <div
            key={conf.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${conf.x}%`,
              top: `${conf.y}px`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div 
              className="confetti-piece"
              style={{ 
                backgroundColor: conf.color,
                width: `${conf.size}px`,
                height: `${conf.size}px`
              }}
            />
          </div>
        ))}
      </div>

      {/* Sparkles */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-sparkle-pop text-yellow-400 text-2xl"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {sparkle.message}
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slideDown">
          <h2 className="text-[#f04299] text-2xl sm:text-3xl font-bold leading-tight mb-2">
            {textConfig.cakeCutting.heading}
          </h2>
          <div className="text-sm text-[#9a4c73]">
            {textConfig.cakeCutting.subheading}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#FFF8E7] rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xl animate-fadeIn relative z-20">
          
          {step === 'cutting' && (
            <div className="space-y-6 animate-slideUp">
              <div className="text-center mb-6">
                <p className="text-lg text-[#1b0d14] font-medium mb-2">
                  {textConfig.cakeCutting.cuttingPrompt}
                </p>
                <p className="text-sm text-[#9a4c73] mb-4">
                  {textConfig.cakeCutting.instructions}
                </p>
                
                {/* Progress indicator */}
                {isDragging && (
                  <div className="text-sm text-[#f04299] font-medium bg-white/80 px-4 py-2 rounded-full inline-block">
                    {textConfig.cakeCutting.progressText}: {Math.round(cutProgress * 100)}% 
                    {cutProgress > 0.5 && ` - ${textConfig.cakeCutting.encouragementText}`}
                  </div>
                )}
              </div>

              {/* Interactive Cake Container */}
              <div className="flex justify-center">
                <div 
                  ref={cakeContainerRef}
                  className="relative select-none touch-none bg-transparent"
                  style={{
                    width: '300px',
                    height: '250px',
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Cake Component */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Cake />
                  </div>
                  
                  {/* Cutting guide zone */}
                  <div 
                    className="absolute bg-yellow-200 opacity-40 animate-pulse pointer-events-none"
                    style={{
                      top: '35%',
                      left: '10%',
                      width: '80%',
                      height: '20%',
                      borderRadius: '8px',
                      border: '2px dashed #ffd700'
                    }}
                  />
                  
                  {/* Instruction text */}
                  <div className="absolute top-2 left-2 text-xs text-[#9a4c73] bg-white/90 px-2 py-1 rounded shadow-sm pointer-events-none">
                    {textConfig.cakeCutting.dragHint}
                  </div>
                  
                  {/* Cut path visualization */}
                  {cutPath.length > 1 && (
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                      <path
                        d={`M ${cutPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                        stroke="#ff6b6b"
                        strokeWidth="4"
                        fill="none"
                        opacity="0.8"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(255, 107, 107, 0.6))'
                        }}
                      />
                    </svg>
                  )}
                  
                  {/* Success animation overlay */}
                  {isFullyCut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-lg z-30">
                      <div className="text-center">
                        <div className="text-5xl mb-2 animate-bounce">🎉</div>
                        <div className="text-xl font-bold text-[#f04299]">{textConfig.cakeCutting.congratulations}</div>
                        <div className="text-sm text-[#9a4c73]">{textConfig.cakeCutting.celebrationMessage}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'wish' && (
            <div className="text-center space-y-6 animate-slideUp">
              {/* Birthday Wish GIF */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src={BirthdayWishGif} 
                    alt="Make a wish"
                    className="w-64 h-48 object-cover rounded-2xl shadow-lg border-4 border-pink-200"
                    onError={(e) => {
                      // Fallback if GIF doesn't exist - show emoji instead
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-64 h-48 flex items-center justify-center text-6xl bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-lg border-4 border-pink-200';
                      fallback.innerHTML = '🎂✨';
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">🎂</div>
              </div>
              
              <h3 className="text-2xl font-bold text-[#f04299] mb-2">
                {textConfig.cakeCutting.makeWishTitle}
              </h3>
              <p className="text-lg text-[#1b0d14] font-medium mb-4">
                {textConfig.cakeCutting.wishPrompt}
              </p>
              <p className="text-sm text-[#9a4c73] mb-6">
                {textConfig.cakeCutting.wishInstructions}
              </p>
              
              <button
                onClick={makeWish}
                disabled={isWishMade}
                className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform ${
                  isWishMade 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed scale-95' 
                    : 'bg-[#f04299] text-white hover:scale-105 active:scale-95 hover:shadow-pink-300/60'
                } focus:outline-none focus:ring-4 focus:ring-pink-300`}
              >
                {textConfig.cakeCutting.wishButton}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Animations & Styles */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
        @keyframes float-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }
        @keyframes birthday-float { 
          0%,100% { transform: translateY(0) rotate(0deg) scale(1);} 
          50% { transform: translateY(-15px) rotate(5deg) scale(1.05);} 
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes sparkle-pop { 
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0); } 
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); } 
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) translateY(-40px); } 
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-birthday-float { animation: birthday-float 6s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease forwards; }
        .animate-sparkle-pop { animation: sparkle-pop 2.5s ease forwards; }
        .animate-confetti-fall { animation: confetti-fall linear infinite; }

        .confetti-piece {
          border-radius: 2px;
          transform: rotate(45deg);
        }

        /* Touch optimization */
        .touch-none {
          touch-action: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default CakeCutting;