import React, { useRef, useEffect, useState } from "react";

interface PhotoGlobeProps {
  photos: string[];
  isActive: boolean;
  initialPhoto?: string;
  onGlobeReady?: () => void;
}

const PhotoGlobe: React.FC<PhotoGlobeProps> = ({ photos, isActive, onGlobeReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<number>();

  const numPhotos = Math.min(photos.length, 150);
  const photoWidth = 80;
  const photoGap = 20;
  const totalWidth = numPhotos * (photoWidth + photoGap);

  // Continuous animation
  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      setOffset((prev) => {
        const newOffset = prev + 1.5;
        return newOffset >= totalWidth ? 0 : newOffset;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    onGlobeReady?.();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, totalWidth, onGlobeReady]);

  if (!isActive) return null;

  // Calculate position and curve for each photo
  const getPhotoStyle = (index: number) => {
    const containerWidth = 800;
    const centerX = containerWidth / 2;
    
    // Base position with offset for continuous movement
    let baseX = index * (photoWidth + photoGap) - offset;
    
    // Wrap around for infinite loop
    while (baseX < -photoWidth) {
      baseX += totalWidth;
    }
    while (baseX > totalWidth) {
      baseX -= totalWidth;
    }
    
    // Calculate distance from center (0 to 1)
    const distanceFromCenter = Math.abs(baseX - centerX + photoWidth / 2) / centerX;
    const normalizedDistance = Math.min(distanceFromCenter, 1);
    
    // Curve outward in center - parabolic curve
    const curveAmount = 120;
    const curveY = curveAmount * (1 - normalizedDistance * normalizedDistance);
    
    // Scale: larger in center, smaller at edges
    const scale = 0.6 + 0.6 * (1 - normalizedDistance * normalizedDistance);
    
    // Opacity: brighter in center
    const opacity = 0.3 + 0.7 * (1 - normalizedDistance);
    
    // Z-index: higher in center
    const zIndex = Math.round(100 - normalizedDistance * 100);
    
    return {
      transform: `translateX(${baseX}px) translateY(${curveY}px) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      {/* Curved track visualization */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "100%",
          height: "300px",
          background: "radial-gradient(ellipse 80% 40% at 50% 100%, hsl(330 85% 55% / 0.08), transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      
      {/* Photo container */}
      <div
        className="relative"
        style={{
          width: "800px",
          height: "400px",
        }}
      >
        {Array.from({ length: numPhotos }).map((_, index) => {
          const style = getPhotoStyle(index);
          
          // Only render if visible
          if (style.opacity < 0.1) return null;
          
          return (
            <div
              key={index}
              className="absolute rounded-lg overflow-hidden shadow-lg border-2 border-white/20"
              style={{
                width: `${photoWidth}px`,
                height: `${photoWidth}px`,
                top: "50%",
                left: "0",
                marginTop: `-${photoWidth / 2}px`,
                ...style,
                transition: "none",
              }}
            >
              <img
                src={photos[index % photos.length]}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {/* Glow effects */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "400px",
          height: "200px",
          bottom: "20%",
          background: "radial-gradient(ellipse, hsl(330 85% 55% / 0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Instruction text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        Watch your memories flow
      </div>
    </div>
  );
};

export default PhotoGlobe;
