import React, { useEffect, useState } from "react";
import textConfig from "../textConfig";
import LetterImg from "../imgs/letter.png"
import StampSVG from "./StampSVG";

interface ActivityPageProps {
  herName?: string;
  onNext?: () => void;
}

export default function ActivityPage({
  herName = "[Her Name]",
  onNext
}: ActivityPageProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [typedLastLine, setTypedLastLine] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Fixed letter message parsing to show complete content
  const letterMessage = textConfig.letter.letterMessage;
  const lines = letterMessage.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
  
  // Get the greeting (first line)
  const greeting = lines[0] || textConfig.letter.letterGreeting;
  
  // Get the main body (all lines except first) - removed the exclusion of last line
  const bodyLines = lines.slice(1);
  const bodyContent = bodyLines.join('\n\n').trim(); // Join with double newlines for proper paragraph spacing

  // Use signature from textConfig instead of hardcoding
  const signature = textConfig.letter.signature || "Forever yours, Happy Birthday! 💕🎂";

  // Handle envelope opening
  const handleEnvelopeClick = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      // Show letter after envelope animation
      setTimeout(() => {
        setShowLetter(true);
        // Start typing animation for signature after a short delay
        setTimeout(() => {
          startTypingSignature();
        }, 500);
      }, 800);
    }
  };

  // Add sparkles on hover
  const addSparkle = (e: React.MouseEvent) => {
    if (isEnvelopeOpen) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y
    };
    
    setSparkles(prev => [...prev, newSparkle]);
    
    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
  };

  // Typing animation only for the signature
  const startTypingSignature = () => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedLastLine(signature.slice(0, i));
      i++;
      if (i > signature.length) {
        clearInterval(interval);
        setTimeout(() => setShowContinue(true), 500);
      }
    }, 50);
  };

  return (
    <div className="font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6">
      {/* Floating pastel icons */}
      <svg
        className="absolute top-10 left-10 w-8 h-8 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#FFF7A1"
        />
      </svg>

      {/* Fixed SVG path */}
      <svg
        className="absolute right-10 top-16 w-10 h-10 opacity-80 animate-float"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M18.5 12c1.38 0 2.5 1.12 2.5 2.5S19.88 17 18.5 17H6.5C4.57 17 3 15.43 3 13.5S4.57 10 6.5 10c.28 0 .5-.22.5-.5C7 6.36 9.36 4 12.5 4S18 6.36 18 9.5c0 .28.22.5.5.5z"
          fill="#B0E0E6"
        />
      </svg>

      <svg
        className="absolute left-12 bottom-20 w-6 h-6 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z"
          fill="#FFD1DC"
        />
      </svg>

      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-slideDown">
          <div className="text-center">
            <h2 className="text-[#f04299] text-lg sm:text-xl font-bold leading-tight">
              {textConfig.letter.headerTitle}
            </h2>
            <div className="text-xs text-[#9a4c73] mt-1">
              {textConfig.letter.headerSubtitle}
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="bg-[#FFF8E7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xl animate-fadeIn">
          
          {!showLetter ? (
            /* Envelope Section */
            <div className="flex flex-col items-center justify-center min-h-[400px] relative">
              <div 
                className={`relative cursor-pointer transition-all duration-800 transform ${
                  isEnvelopeOpen ? 'scale-110 rotate-2' : 'hover:scale-105 hover:-rotate-1'
                }`}
                onClick={handleEnvelopeClick}
                onMouseMove={addSparkle}
              >
                {/* Sparkles */}
                {sparkles.map(sparkle => (
                  <div
                    key={sparkle.id}
                    className="absolute pointer-events-none text-yellow-400 animate-sparkle-pop"
                    style={{
                      left: sparkle.x,
                      top: sparkle.y,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    ✨
                  </div>
                ))}

                {/* Envelope */}
                <div className="relative w-80 h-56 mx-auto">
                  {/* Envelope Body */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFE4E6] to-[#FFF0F5] rounded-lg shadow-lg border-2 border-pink-200" />
                  
                  {/* Envelope Flap */}
                  <div 
                    className={`absolute -top-1 left-0 right-0 h-28 bg-gradient-to-br from-[#FFD1DC] to-[#FFC0CB] transition-all duration-800 origin-top ${
                      isEnvelopeOpen ? '-rotate-12 translate-y-2' : ''
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      borderRadius: '8px 8px 0 0'
                    }}
                  />

                  {/* Wax Seal */}
                  {!isEnvelopeOpen && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#f04299] rounded-full flex items-center justify-center text-white text-xl shadow-md animate-pulse">
                      💌
                    </div>
                  )}

                  {/* Letter peeking out */}
                  {isEnvelopeOpen && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-72 h-48 bg-white rounded shadow-md animate-letter-emerge border border-pink-100" />
                  )}

                  {/* Decorative hearts */}
                  <div className="absolute -top-2 -right-2 text-pink-300 text-sm animate-bounce-slow">💕</div>
                  <div className="absolute -bottom-2 -left-2 text-pink-300 text-xs animate-bounce-slow" style={{ animationDelay: '0.5s' }}>💖</div>
                </div>

                {!isEnvelopeOpen && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-[#9a4c73] mb-2">{textConfig.letter.envelopeClickHint}</p>
                    <div className="inline-block px-4 py-2 bg-pink-50 rounded-full text-xs font-medium text-[#f04299] border border-pink-200 animate-pulse">
                      {textConfig.letter.specialDeliveryText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Letter Content Section */
            <div className="min-h-[400px] relative animate-fadeIn">
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-inner border border-pink-100 min-h-[350px] relative">
                {/* Paper texture background */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-pink-50 to-transparent rounded-xl" />
                
                {/* Letter image - positioned relative to this letter container */}
                <div 
                  className="absolute -top-6 -right-6 animate-float-slow opacity-80 pointer-events-none z-30"
                  style={{
                    transform: 'rotate(15deg)',
                  }}
                >
                  <img
                    src={LetterImg}
                    alt="Love"
                    className="w-24 h-auto object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Letter header */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-100 relative">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f04299] flex items-center justify-center text-white text-sm">
                        💝
                      </div>
                      <span className="text-sm font-semibold text-[#9a4c73]">{textConfig.letter.letterHeaderTitle}</span>
                    </div>
                  </div>

                  {/* Letter content - proper letter formatting with reduced margins */}
                  <div className="handwriting text-sm sm:text-base leading-relaxed text-[#1b0d14] pb-6 pt-6">
                    {/* Greeting - left aligned */}
                    <div className="mb-4 text-[#f04299] font-medium">
                      {greeting}
                    </div>

                    {/* Main body - with proper paragraph spacing */}
                    <div className="mb-4 text-justify whitespace-pre-line" style={{ textIndent: '2rem' }}>
                      {bodyContent}
                    </div>
                    
                    {/* Signature with typing animation - positioned like a real letter signature */}
                    <div className="mt-6 ml-auto w-fit">
                      <div className="font-medium text-[#f04299]">
                        {typedLastLine}
                        {typedLastLine.length < signature.length && (
                          <span className="inline-block w-1 h-5 bg-[#f04299] ml-1 animate-cursor" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stamp at bottom left - reduced margin and better positioning */}
                <div className="absolute bottom-2 left-2 transform -rotate-12 animate-float-slow opacity-40">
                  <StampSVG className="w-20 h-14" color="#f04299" />
                </div>

                {/* Decorative elements - adjusted positions */}
                <div className="absolute top-4 left-4 text-pink-300 opacity-30 text-xs animate-float-slow">✨</div>
                <div className="absolute bottom-16 right-4 text-pink-300 opacity-30 text-xs animate-float-slow" style={{ animationDelay: '1s' }}>💕</div>
              </div>

              {/* Continue Button */}
              {showContinue && (
                <div className="flex justify-center mt-6 animate-slideUp">
                  <button
                    onClick={onNext}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#f04299] text-white font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95 hover:shadow-pink-300/50 focus:outline-none focus:ring-4 focus:ring-pink-300"
                  >
                    {textConfig.letter.continueButton}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Animations & Styles */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
        @keyframes float-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }
        @keyframes bounce-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-4px);} }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes sparkle-pop { 
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0); } 
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } 
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) translateY(-20px); } 
        }
        @keyframes letter-emerge { 
          from { transform: translateX(-50%) translateY(100%); opacity: 0; } 
          to { transform: translateX(-50%) translateY(0); opacity: 1; } 
        }
        @keyframes cursorBlink { 0%,50% { opacity: 1;} 50%,100% { opacity: 0;} }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease forwards; }
        .animate-sparkle-pop { animation: sparkle-pop 1s ease forwards; }
        .animate-letter-emerge { animation: letter-emerge 0.8s ease forwards; }
        .animate-cursor { animation: cursorBlink 1s infinite; }

        .handwriting {
          font-family: 'Kalam', cursive;
        }
      `}</style>
    </div>
  );
}