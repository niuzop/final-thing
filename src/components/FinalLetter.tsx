import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import textConfig from "../textConfig";

interface FinalLetterProps {
  onRestart: () => void;
  onSurprise?: () => void;
}

export default function FinalLetter({ onRestart, onSurprise }: FinalLetterProps) {
  const [showLetter, setShowLetter] = useState(false);
  const [showSealing, setShowSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const typingTextRef = useRef(textConfig.finalLetter.typedDefault);
  const [typedText, setTypedText] = useState("");
  const typingTimerRef = useRef<number | null>(null);

  const [kisses, setKisses] = useState<
    { id: number; left: number; delay: number; size: number; rotation: number }[]
  >([]);
  const kissIdRef = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => setShowLetter(true), 420);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isSealed) {
      setTypedText("");
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      return;
    }
    const str = typingTextRef.current;
    let i = 0;
    typingTimerRef.current = window.setInterval(() => {
      i += 1;
      setTypedText(str.slice(0, i));
      if (i >= str.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 45);
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [isSealed]);

  const sealLetter = () => {
    setShowSealing(true);
    setTimeout(() => {
      setIsSealed(true);
      setShowSealing(false);
    }, 1400);
  };

  const sendKiss = () => {
    const batch: typeof kisses = [];
    for (let i = 0; i < 10; i++) {
      const id = ++kissIdRef.current;
      batch.push({
        id,
        left: 8 + Math.random() * 84,
        delay: i * 80 + Math.random() * 120,
        size: 18 + Math.round(Math.random() * 18),
        rotation: -20 + Math.random() * 40,
      });
    }
    setKisses((s) => [...s, ...batch]);

    const maxDelay = Math.max(...batch.map((k) => k.delay));
    setTimeout(() => {
      setKisses((s) => s.filter((k) => !batch.find((b) => b.id === k.id)));
    }, 2200 + maxDelay);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--romantic-pink-light))] via-[hsl(330_70%_95%)] to-[hsl(var(--romantic-peach))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <svg className="absolute top-10 left-10 w-6 h-6 text-pink-200 opacity-60 animate-bounce-slow" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z" />
      </svg>
      <svg className="absolute top-20 right-16 w-4 h-4 text-pink-300 opacity-50 animate-bounce-slow" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.5s' }}>
        <path d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z" />
      </svg>
      <svg className="absolute bottom-16 left-20 w-5 h-5 text-pink-200 opacity-40 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z" />
      </svg>

      {/* Kiss particles */}
      <div className="pointer-events-none fixed inset-0 z-40">
        {kisses.map((k) => (
          <div
            key={k.id}
            className="kiss-particle"
            style={{
              left: `${k.left}%`,
              bottom: 12,
              fontSize: k.size,
              transform: `translateX(-50%) rotate(${k.rotation}deg)`,
              animationDelay: `${k.delay}ms`,
            }}
          >
            <span className="block">💋</span>
            <span className="sparkle" />
          </div>
        ))}
      </div>

      {/* Sealing overlay */}
      {showSealing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(330_70%_97%/0.75)]">
          <div className="flex flex-col items-center gap-3">
            <div className="text-7xl animate-seal-spin">{textConfig.finalLetter.sealingEmoji}</div>
            <div className="text-sm text-muted-foreground">{textConfig.finalLetter.sealingText}</div>
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-slideDown">
          <div className="text-center">
            <h2 className="text-primary text-lg sm:text-xl font-bold leading-tight">
              {textConfig.finalLetter.pageTitle}
            </h2>
            <div className="text-xs text-muted-foreground mt-1">
              {textConfig.finalLetter.pageSubtitle}
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="bg-[hsl(45_80%_96%)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border shadow-xl animate-fadeIn relative">
          
          {/* Main letter content */}
          <div
            className={`relative transition-all duration-600 ${
              showLetter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {!isSealed ? (
              <div className="bg-card rounded-xl p-6 sm:p-8 shadow-inner border border-border min-h-[400px] relative">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-pink-50 to-transparent rounded-xl" />

                <div className="absolute -top-2 -right-2 text-pink-300 text-sm animate-bounce-slow">{textConfig.finalLetter.decorativeEmojis.topRight}</div>
                <div className="absolute -bottom-2 -left-2 text-pink-300 text-xs animate-bounce-slow" style={{ animationDelay: '0.5s' }}>{textConfig.finalLetter.decorativeEmojis.bottomLeft}</div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-border relative">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                        {textConfig.finalLetter.letterIcon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">{textConfig.finalLetter.title}</span>
                    </div>
                  </div>

                  <div className="handwriting text-sm sm:text-base leading-relaxed text-foreground pb-6 pt-6">
                    <div className="mb-4 text-primary font-medium">
                      {textConfig.finalLetter.letterGreeting}
                    </div>

                    <div className="space-y-4 mb-6">
                      {textConfig.finalLetter.letterParagraphs.map((paragraph, index) => (
                        <p 
                          key={index}
                          className={`${
                            index === 0 ? 'text-foreground' :
                            index === 1 ? 'text-sky-400' :
                            index === 2 ? 'text-foreground' :
                            index === 3 ? 'text-purple-300' :
                            'text-primary font-medium'
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 items-center border-t border-border pt-4">
                    <div className="text-xs text-muted-foreground">{textConfig.finalLetter.sealingNote}</div>
                    <div className="flex gap-3">
                      <button
                        onClick={sealLetter}
                        className="btn-romantic"
                      >
                        {textConfig.finalLetter.sealButton}
                      </button>

                      <button
                        onClick={onRestart}
                        className="btn-mint"
                      >
                        {textConfig.finalLetter.restartButton}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl p-8 sm:p-10 shadow-inner border border-border text-center relative min-h-[400px] flex flex-col justify-center">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-pink-50 to-transparent rounded-xl" />
                
                <div className="absolute -top-2 -right-2 text-pink-300 text-sm animate-bounce-slow">{textConfig.finalLetter.decorativeEmojis.topRight}</div>
                <div className="absolute -bottom-2 -left-2 text-pink-300 text-xs animate-bounce-slow" style={{ animationDelay: '0.5s' }}>{textConfig.finalLetter.decorativeEmojis.bottomLeft}</div>

                <div className="relative z-10">
                  <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(330_70%_85%)] to-[hsl(330_80%_90%)] flex items-center justify-center shadow-inner">
                    <div className="text-4xl">{textConfig.finalLetter.sealedEmoji}</div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-primary mb-2">
                    {textConfig.finalLetter.sealedTitle}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-5">
                    {textConfig.finalLetter.sealedSubtitle}
                  </p>

                  <div className="flex justify-center gap-2 mb-5">
                    {Array.from({ length: textConfig.finalLetter.heartCount || 7 }).map((_, i) => (
                      <Heart
                        key={i}
                        size={18}
                        className="text-pink-300 animate-pulse-heart"
                        style={{ animationDelay: `${i * 140}ms` }}
                      />
                    ))}
                  </div>

                  <div className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                    <span className="text-primary">{typedText || textConfig.finalLetter.typedDefault}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-6">
                    {new Date().toLocaleDateString(textConfig.finalLetter.dateLocale, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={onRestart}
                      className="btn-romantic"
                    >
                      {textConfig.finalLetter.experienceAgain}
                    </button>

                    <button
                      onClick={sendKiss}
                      className="btn-mint"
                    >
                      {textConfig.finalLetter.sendKissButton}
                    </button>
                  </div>

                  {/* Surprise button */}
                  {onSurprise && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        onClick={onSurprise}
                        className="rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 px-6 py-3 text-sm sm:text-base font-semibold shadow-lg hover:scale-105 transition-all text-white animate-pulse-glow"
                      >
                        {textConfig.surprisePage.surpriseButtonText} ✨
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-float-slow { animation: floatSlow 10s ease-in-out infinite; }
        .animate-seal-spin { animation: spinSeal 1.4s ease-in-out; }
        .animate-pulse-heart { animation: pulseHeart 1.1s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }

        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatSlow {
          0% { transform: translateY(0) translateX(0); opacity: .9; }
          50% { transform: translateY(-12px) translateX(6px); opacity: 1; }
          100% { transform: translateY(0) translateX(0); opacity: .9; }
        }

        @keyframes spinSeal {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }

        @keyframes pulseHeart {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .kiss-particle {
          position: absolute;
          bottom: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: center;
          will-change: transform, opacity;
          animation: kissRise 1600ms cubic-bezier(.2,.8,.2,1) forwards;
        }

        .kiss-particle .sparkle {
          width: 8px;
          height: 8px;
          margin-top: 6px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.6) 40%, transparent 60%);
          border-radius: 50%;
          opacity: 0.9;
          transform-origin: center;
          animation: sparklePop 800ms ease-out forwards;
        }

        @keyframes kissRise {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(0.9); opacity: 0.95; }
          30% { transform: translateY(-30px) translateX(var(--driftX, 0px)) rotate(var(--rot, 0deg)) scale(1.05); opacity: 1; }
          100% { transform: translateY(-140px) translateX(var(--driftX, 0px)) rotate(calc(var(--rot, 0deg) * 1.3)) scale(0.9); opacity: 0; }
        }

        @keyframes sparklePop {
          0% { transform: scale(0.6); opacity: 0; }
          30% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
