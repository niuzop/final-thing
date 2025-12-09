import React, { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const SpaceBackground: React.FC = () => {
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < 200; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    return starArray;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep space gradient */}
      <div className="absolute inset-0 space-bg" />
      
      {/* Nebula effects */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(300 60% 40%), transparent 70%)",
          top: "10%",
          left: "-10%",
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(200 80% 50%), transparent 70%)",
          bottom: "20%",
          right: "-5%",
        }}
      />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.size > 2 
              ? "radial-gradient(circle, hsl(45 100% 90%), hsl(45 100% 75%) 50%, transparent 70%)"
              : "hsl(60 100% 97%)",
            boxShadow: star.size > 2 
              ? `0 0 ${star.size * 2}px hsl(45 100% 75% / 0.5)`
              : `0 0 ${star.size}px hsl(60 100% 97% / 0.3)`,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}
      
      {/* Shooting star effect (occasional) */}
      <div 
        className="absolute w-1 h-1 bg-white rounded-full opacity-0"
        style={{
          animation: "shootingStar 8s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
      
      <style>{`
        @keyframes shootingStar {
          0%, 95%, 100% { 
            opacity: 0; 
            transform: translateX(0) translateY(0);
            left: 80%;
            top: 10%;
          }
          96% {
            opacity: 1;
          }
          98% {
            opacity: 1;
            transform: translateX(-300px) translateY(200px);
            box-shadow: 0 0 10px white, -100px -50px 20px transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default SpaceBackground;
