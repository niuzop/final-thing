import React from "react";
import SpaceBackground from "@/components/SpaceBackground";
import PhotoGlobe from "@/components/PhotoGlobe";

// ============================================
// CUSTOMIZE YOUR PHOTOS HERE
// Replace these placeholder URLs with your own image URLs
// You can use local images by importing them or use external URLs
// ============================================
const CUSTOM_PHOTOS: string[] = [
  // Add your photo URLs here, for example:
  // "https://example.com/photo1.jpg",
  // "https://example.com/photo2.jpg",
  // Or import local images at the top and add them here
];

// Placeholder photos (will be used if CUSTOM_PHOTOS is empty)
const placeholderPhotos = Array.from({ length: 50 }, (_, i) => 
  `https://picsum.photos/seed/${i + 100}/200/200`
);

const GlobePage: React.FC = () => {
  const photos = CUSTOM_PHOTOS.length > 0 ? CUSTOM_PHOTOS : placeholderPhotos;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-romantic text-white mb-8 text-center px-4">
          Our Beautiful Memories
        </h1>
        
        <div className="w-full h-[500px]">
          <PhotoGlobe
            photos={photos}
            isActive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
