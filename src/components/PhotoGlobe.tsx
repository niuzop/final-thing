import React, { useMemo, useRef, useEffect, useState } from "react";

interface PhotoGlobeProps {
  photos: string[];
  isActive: boolean;
  initialPhoto?: string;
  onGlobeReady?: () => void;
}

interface PhotoPosition {
  id: number;
  phi: number;
  theta: number;
  photo: string;
}

const PhotoGlobe: React.FC<PhotoGlobeProps> = ({ photos, isActive, initialPhoto, onGlobeReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [manualRotation, setManualRotation] = useState(0);
  const animationRef = useRef<number>();

  // Fibonacci sphere distribution for even spacing
  const photoPositions = useMemo(() => {
    const positions: PhotoPosition[] = [];
    const numPhotos = Math.min(photos.length, 150);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < numPhotos; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPhotos);
      
      positions.push({
        id: i,
        phi,
        theta,
        photo: photos[i % photos.length],
      });
    }
    
    return positions;
  }, [photos]);

  // Auto-rotation
  useEffect(() => {
    if (!isActive || isDragging) return;

    const animate = () => {
      setRotation((prev) => prev + 0.002);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    onGlobeReady?.();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isDragging, onGlobeReady]);

  // Mouse/touch handlers for manual rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastX(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastX;
    setManualRotation((prev) => prev + deltaX * 0.005);
    setLastX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const globeRadius = 280;
  const photoSize = 50;
  const totalRotation = rotation + manualRotation;

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ perspective: "1200px" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="relative"
        style={{
          width: `${globeRadius * 2}px`,
          height: `${globeRadius * 2}px`,
          transformStyle: "preserve-3d",
          transform: `rotateY(${totalRotation}rad)`,
        }}
      >
        {photoPositions.map((pos) => {
          // Convert spherical to Cartesian coordinates
          const x = globeRadius * Math.sin(pos.phi) * Math.cos(pos.theta);
          const y = globeRadius * Math.cos(pos.phi);
          const z = globeRadius * Math.sin(pos.phi) * Math.sin(pos.theta);
          
          // Calculate opacity based on z position (front = visible, back = hidden)
          const rotatedZ = z * Math.cos(totalRotation) - x * Math.sin(totalRotation);
          const opacity = Math.max(0.1, (rotatedZ + globeRadius) / (globeRadius * 2));
          const scale = 0.6 + (opacity * 0.4);
          
          return (
            <div
              key={pos.id}
              className="absolute rounded-lg overflow-hidden shadow-lg border-2 border-white/20 transition-opacity duration-200"
              style={{
                width: `${photoSize}px`,
                height: `${photoSize}px`,
                left: `calc(50% - ${photoSize / 2}px)`,
                top: `calc(50% - ${photoSize / 2}px)`,
                transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                transformStyle: "preserve-3d",
                opacity: opacity,
                zIndex: Math.round(rotatedZ + globeRadius),
                // Keep photos always facing forward (flat)
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={pos.photo}
                alt={`Memory ${pos.id + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {/* Globe glow effect */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `${globeRadius * 2.2}px`,
          height: `${globeRadius * 2.2}px`,
          background: "radial-gradient(circle, hsl(330 85% 55% / 0.1), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Instruction text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        Drag to explore your memories
      </div>
    </div>
  );
};

export default PhotoGlobe;
