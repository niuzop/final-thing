import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FlipCardProps {
  message: string;
  photoUrl: string;
  onExploreGlobe: () => void;
}

const FlipCard: React.FC<FlipCardProps> = ({ message, photoUrl, onExploreGlobe }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExploreButton, setShowExploreButton] = useState(false);

  useEffect(() => {
    // Fade in message
    const messageTimer = setTimeout(() => setShowMessage(true), 500);
    // Show flip button after message appears
    const buttonTimer = setTimeout(() => setShowButton(true), 2000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  useEffect(() => {
    if (isFlipped) {
      // Show explore button after flip completes
      const timer = setTimeout(() => setShowExploreButton(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(true);
    setShowButton(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div 
        className="flip-card w-80 h-96 sm:w-96 sm:h-[28rem]"
        style={{ perspective: "1000px" }}
      >
        <div 
          className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front - Message */}
          <div 
            className="flip-card-front absolute w-full h-full rounded-2xl p-8 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, hsl(260 40% 20% / 0.9), hsl(280 50% 15% / 0.9))",
              border: "2px solid hsl(330 85% 55% / 0.3)",
              boxShadow: "0 0 60px hsl(330 85% 55% / 0.2), inset 0 0 30px hsl(260 50% 30% / 0.3)",
            }}
          >
            <div 
              className={`text-center transition-all duration-1000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <p className="script-font text-3xl sm:text-4xl text-white leading-relaxed mb-8">
                {message}
              </p>
              
              {showButton && (
                <Button
                  onClick={handleFlip}
                  className="animate-fade-in-up btn-romantic text-lg px-8 py-6"
                >
                  Flip ✨
                </Button>
              )}
            </div>
          </div>

          {/* Back - Photo */}
          <div 
            className="flip-card-back absolute w-full h-full rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              border: "3px solid hsl(330 85% 55% / 0.5)",
              boxShadow: "0 0 80px hsl(330 85% 55% / 0.3)",
            }}
          >
            <img
              src={photoUrl}
              alt="Special memory"
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Explore Globe Button */}
      {showExploreButton && (
        <div className="mt-8 animate-fade-in-up">
          <Button
            onClick={onExploreGlobe}
            className="btn-romantic text-lg px-10 py-6 animate-pulse-glow"
          >
            Explore Globe 🌍
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlipCard;
