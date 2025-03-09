"use client"; // Ensure it's a client component

import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures the component only runs browser-related code in the client
  }, []);

  const textToSpeech = (text) => {
    if (isClient && typeof window !== "undefined" && "speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech!");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg mt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => (
              <h2
                key={index}
                className={`p-2 bg-primary rounded-lg text-sm md:text-sm text-white text-center cursor-pointer 
                ${activeQuestionIndex === index ? "bg-red-500 text-white" : ""}`}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.Question}
        </h2>
        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)
          }
        />
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2>
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
};

export default QuestionSection;
