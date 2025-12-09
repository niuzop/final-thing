import React, { useState, useEffect, useRef, useMemo } from "react";
import SpaceBackground from "./SpaceBackground";
import FlipCard from "./FlipCard";
import PhotoGlobe from "./PhotoGlobe";
import textConfig from "../textConfig";

interface SurprisePageProps {
  onBack?: () => void;
}

// Generate placeholder photo URLs for the globe
const generatePhotos = (count: number): string[] => {
  const photos: string[] = [];
  // Using picsum.photos for varied placeholder images
  for (let i = 0; i < count; i++) {
    // Add variety with different image IDs
    photos.push(`https://picsum.photos/seed/${i + 100}/200/200`);
  }
  return photos;
};

const SurprisePage: React.FC<SurprisePageProps> = ({ onBack }) => {
  const [stage, setStage] = useState<"flip" | "diving" | "globe">("flip");
  const [mainPhotoUrl] = useState("https://picsum.photos/seed/special/400/500");
  const [showDivingPhoto, setShowDivingPhoto] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Generate 150 photos for the globe
  const globePhotos = useMemo(() => generatePhotos(150), []);

  // Play music when component mounts
  useEffect(() => {
    // Create audio element for ambient space music
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    // Using a royalty-free ambient track URL (placeholder - you can replace with actual music)
    audioRef.current.src = "https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3";
    
    const playMusic = async () => {
      try {
        await audioRef.current?.play();
      } catch (e) {
        // Autoplay might be blocked, that's okay
        console.log("Audio autoplay blocked, waiting for user interaction");
      }
    };

    playMusic();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleExploreGlobe = () => {
    setShowDivingPhoto(true);
    setStage("diving");
    
    // After dive animation, show globe
    setTimeout(() => {
      setShowDivingPhoto(false);
      setStage("globe");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {stage === "flip" && (
          <FlipCard
            message={textConfig.surprisePage.initialMessage}
            photoUrl={mainPhotoUrl}
            onExploreGlobe={handleExploreGlobe}
          />
        )}

        {stage === "diving" && showDivingPhoto && (
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div 
              className="w-80 h-96 sm:w-96 sm:h-[28rem] rounded-2xl overflow-hidden animate-dive-in"
              style={{
                border: "3px solid hsl(330 85% 55% / 0.5)",
                boxShadow: "0 0 80px hsl(330 85% 55% / 0.3)",
              }}
            >
              <img
                src={mainPhotoUrl}
                alt="Special memory"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {stage === "globe" && (
          <div className="fixed inset-0 flex items-center justify-center">
            <PhotoGlobe 
              photos={globePhotos}
              isActive={true}
              initialPhoto={mainPhotoUrl}
            />
          </div>
        )}

        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="fixed top-6 left-6 z-30 text-white/70 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default SurprisePage;
