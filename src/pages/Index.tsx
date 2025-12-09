import React, { useState } from "react";
import FinalLetter from "@/components/FinalLetter";
import SurprisePage from "@/components/SurprisePage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"letter" | "surprise">("letter");

  const handleRestart = () => {
    setCurrentPage("letter");
  };

  const handleSurprise = () => {
    setCurrentPage("surprise");
  };

  const handleBackFromSurprise = () => {
    setCurrentPage("letter");
  };

  return (
    <>
      {currentPage === "letter" && (
        <FinalLetter 
          onRestart={handleRestart} 
          onSurprise={handleSurprise}
        />
      )}
      {currentPage === "surprise" && (
        <SurprisePage onBack={handleBackFromSurprise} />
      )}
    </>
  );
};

export default Index;
