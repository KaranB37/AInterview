"use client"; // Ensure it's a client component

import { Lightbulb, Volume2, HelpCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex, result }) => {
  const [isClient, setIsClient] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsClient(true); // This ensures the component only runs browser-related code in the client
    
    // Clean up any ongoing speech when component unmounts
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const textToSpeech = (text) => {
    if (isClient && typeof window !== "undefined" && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const speech = new SpeechSynthesisUtterance(text);
      setIsSpeaking(true);
      
      speech.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech!");
    }
  };

  if (!mockInterviewQuestion) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-gray-500">No questions available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Question {activeQuestionIndex + 1}</h3>
        
        <div className="flex items-start space-x-3 mb-6">
          <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 mt-1">
            <HelpCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-800 text-lg font-medium leading-relaxed">
              {mockInterviewQuestion[activeQuestionIndex]?.Question}
            </p>
            <button
              onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}
              className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isSpeaking 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              {isSpeaking ? "Speaking..." : "Listen"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 mb-2">
        <h4 className="text-sm font-medium text-gray-500 mb-2">All Questions</h4>
        <div className="flex flex-wrap gap-2">
          {mockInterviewQuestion.map((question, index) => (
            <div
              key={index}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                activeQuestionIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Q{index + 1}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-medium text-amber-700">Helpful Tips</h3>
        </div>
        <p className="text-amber-800 text-sm">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE || 
            "Take your time to understand the question. Speak clearly and confidently when answering. It's okay to take a moment to gather your thoughts."}
        </p>
      </div>
    </div>
  );
};

export default QuestionSection;
