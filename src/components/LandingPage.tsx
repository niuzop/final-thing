import React, { useEffect, useState } from "react";
import IntroGif from "../imgs/intro.gif"
import IntroImg from "../imgs/intro.png"
import textConfig from "../textConfig";

type Props = {
  onEnter?: () => void;
  herName?: string;
  yourName?: string;
  gifSrc?: string;
};

const LandingPage: React.FC<Props> = ({
  onEnter,
  gifSrc,
}) => {
  const gifUrl = gifSrc || IntroGif;
  
  // Function to separate text from emojis
  const separateTextAndEmojis = (text: string) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const textOnly = text.replace(emojiRegex, '').trim();
    const emojisOnly = text.match(emojiRegex)?.join(' ') || '';
    return { textOnly, emojisOnly };
  };

  const { textOnly: titleText, emojisOnly: titleEmojis } = separateTextAndEmojis(textConfig.landing.title);

  const handleEnter = () => {
    if (onEnter) onEnter();
    else {
      const el = document.getElementById("activity");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else console.log("Click to Begin pressed!");
    }
  };

  // Typing effect for last line
  const [typedText, setTypedText] = useState("");
  
  // Birthday confetti animation state - reduced count
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; size: number; color: string }[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(textConfig.landing.lastLine.slice(0, i));
      i++;
      if (i > textConfig.landing.lastLine.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Generate birthday confetti - reduced from 20 to 8
  useEffect(() => {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#ff3838', '#70a1ff', '#5352ed'];
    const newConfetti = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 4,
      size: 8 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="font-display relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-10">
      {/* Birthday Confetti */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {confetti.map((conf) => (
          <div
            key={conf.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${conf.x}%`,
              top: '-10px',
              animationDelay: `${conf.delay}s`,
              animationDuration: '3s'
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

      {/* Reduced floating birthday icons - only 2 instead of 4 */}
      <div className="absolute top-8 left-8 animate-birthday-float">
        <div className="text-3xl">🎂</div>
      </div>

      {/* Reduced sparkle SVGs - only 1 instead of 2 */}
      <svg
        className="absolute top-16 left-1/4 w-8 h-8 animate-sparkle-birthday opacity-80"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#ff6b9d"
        />
      </svg>

      {/* Main Birthday Card */}
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#FFF8E7] via-[#FFF4F8] to-[#FFF0F5] rounded-3xl shadow-2xl border-2 border-pink-200 p-6 sm:p-8 md:p-10 z-10 animate-birthday-entrance mx-auto overflow-visible"
      >

        {/* Floating birthday GIF - enhanced z-index to prevent cropping */}
        <div className="absolute -top-8 right-4 z-50">
          <div className="relative">
            <img
              src={gifUrl}
              alt="birthday celebration"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain animate-birthday-bounce drop-shadow-lg"
            />
            <div className="absolute -top-2 -right-2 animate-spin-slow">🎂</div>
          </div>
        </div>

        {/* Header with birthday theme */}
        <div className="flex items-center justify-between border-b-2 border-gradient-to-r from-pink-200 to-purple-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#ff9ec7] to-[#ff6b9d] border border-[#f081a9] animate-pulse" />
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#fff07a] to-[#f8b500] border border-[#f0cf52] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#b1f2b1] to-[#70ff70] border border-[#92d992] animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[#9a4c73]">Happy Birthday!</p>
          </div>
          <div className="w-16" />
        </div>

        {/* Enhanced Birthday Content */}
        <div className="text-center space-y-6 relative z-10">
          {/* Title with proper text and emoji separation from textConfig */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-snug">
            <span className="bg-[#f04299] bg-clip-text text-transparent">
              {titleText}
            </span>
            {titleEmojis && <span className="ml-2">{titleEmojis}</span>}
          </h1>

          <div className="text-[#1b0d14]/80 text-base md:text-lg leading-relaxed relative mx-auto max-w-lg">
            <p className="mb-4">
              {textConfig.landing.subtitle}
            </p>
            <p className="pt-3">
              <span className="font-semibold bg-gradient-to-r from-[#f04299] to-[#ff6b9d] bg-clip-text text-transparent">{typedText}</span>
              <span className="inline-block w-1.5 h-4 bg-gradient-to-r from-[#f04299] to-[#ff6b9d] ml-1 animate-cursor" />
            </p>
          </div>

          {/* Enhanced Birthday Button */}
          <button
            onClick={handleEnter}
            className="mt-6 relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#f04299] text-white font-bold text-lg shadow-xl transition-all transform hover:scale-110 active:scale-95 hover:shadow-pink-300/60 focus:outline-none focus:ring-4 focus:ring-pink-300 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-[#ff6b9d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">
              {textConfig.landing.button}
            </span>
          </button>

          {/* Birthday decorative image - enhanced positioning */}
          <div 
            className="absolute -bottom-8 -left-6 animate-birthday-wiggle opacity-80 pointer-events-none"
            style={{
              transform: 'rotate(-20deg)',
              zIndex: 20
            }}
          >
            <img
              src={IntroImg}
              alt="Birthday decoration"
              className="w-24 h-auto object-contain drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Footer - reduced emojis */}
      <div className="mt-8 text-sm text-[#9a4c73] text-center font-medium">
        {textConfig.landing.footer}
      </div>

      {/* Enhanced Birthday Animations */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes float-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }
        @keyframes birthday-float { 
          0%,100% { transform: translateY(0) rotate(0deg) scale(1);} 
          50% { transform: translateY(-15px) rotate(5deg) scale(1.05);} 
        }
        @keyframes birthday-bounce { 
          0%,100% { transform: translateY(0) scale(1);} 
          50% { transform: translateY(-12px) scale(1.1);} 
        }
        @keyframes birthday-wiggle { 
          0%,100% { transform: rotate(-20deg);} 
          25% { transform: rotate(-25deg) translateY(-2px);} 
          75% { transform: rotate(-15deg) translateY(-2px);} 
        }
        @keyframes birthday-entrance { 
          from { opacity: 0; transform: scale(0.9) translateY(30px);} 
          to { opacity: 1; transform: scale(1) translateY(0);} 
        }
        @keyframes sparkle-birthday { 
          0%,100% { transform: scale(1) rotate(0deg); opacity: 0.8;} 
          50% { transform: scale(1.3) rotate(180deg); opacity: 1;} 
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes twinkle { 
          0%,100% { opacity: 0.6; transform: scale(1);} 
          50% { opacity: 1; transform: scale(1.2);} 
        }
        @keyframes spin-slow { 
          from { transform: rotate(0deg);} 
          to { transform: rotate(360deg);} 
        }
        @keyframes cursorBlink { 0%,50% { opacity: 1;} 50%,100% { opacity: 0;} }

        .animate-birthday-float { animation: birthday-float 6s ease-in-out infinite; }
        .animate-birthday-bounce { animation: birthday-bounce 4s ease-in-out infinite; }
        .animate-birthday-wiggle { animation: birthday-wiggle 3s ease-in-out infinite; }
        .animate-birthday-entrance { animation: birthday-entrance 1.2s ease forwards; }
        .animate-sparkle-birthday { animation: sparkle-birthday 2s ease-in-out infinite; }
        .animate-confetti-fall { animation: confetti-fall linear infinite; }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-cursor { animation: cursorBlink 1s infinite; }

        .confetti-piece {
          border-radius: 2px;
          transform: rotate(45deg);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .confetti-piece {
            width: 6px !important;
            height: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
