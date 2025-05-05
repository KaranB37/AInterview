'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Button } from '../../../../../../components/ui/button';
import { toast } from 'sonner';
import { Mic, StopCircle, Loader2, AlertCircle, CheckCircle, Waveform } from 'lucide-react';
import useSpeechToText from 'react-hook-speech-to-text';
import chatSession from '../../../../../../utils/GeminiAIModel';
import { UserAnswer } from '../../../../../../utils/schema'; // Import UserAnswer schema directly
import { db } from '../../../../../../utils/db'; // Make sure to import db properly
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter, usePathname } from 'next/navigation';
import webcamimg from "./webcam.png";

export const RecordAnsSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }) => {
  console.log(interviewData)
  const router = useRouter();
  const pathname = usePathname();
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Update user answer when speech recognition returns results
  useEffect(() => {
    console.log("User Data", user)
    if (results.length > 0) {
      setUserAnswer(prev => prev + " " + results.map(res => res.transcript).join(" "));
    }
  }, [results]);

  // Extract mockId from the URL path
  const extractMockId = () => {
    // Parse the pathname (e.g., "/dashboard/interview/22bb8b3a-ccc3-4f35-a2b1-348af56f68e8/start")
    const pathParts = pathname?.split('/') || [];
    // The mockId should be the part between "interview" and "start"
    const interviewIndex = pathParts.findIndex(part => part === 'interview');
    if (interviewIndex !== -1 && pathParts.length > interviewIndex + 1) {
      console.log("Extracted mockId:", pathParts[interviewIndex + 1]);
      return pathParts[interviewIndex + 1];
    }
    return "Unknown";
  };

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      console.log("Final Answer:", userAnswer);

      if (userAnswer.trim().length < 10) {
        toast.error("Your answer is too short. Please speak clearly and try again.");
        return;
      }

      await UpdateUserAnswer();
    } else {
      setUserAnswer(""); // Clear previous answer before recording new one
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);

      if (!mockInterviewQuestion || !mockInterviewQuestion[activeQuestionIndex]) {
        toast.error("Error: Invalid question data.");
        return;
      }

      const questionData = mockInterviewQuestion[activeQuestionIndex];
      const questionText = questionData?.Question || "Unknown Question";
      const feedbackPrompt = `Question: ${questionText}, User Answer: ${userAnswer}. Provide a JSON response with 'rating' and 'feedback' and 'correctAns'.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawText = await result.response.text();

      // Extract JSON safely
      const jsonMatch = rawText.match(/```json([\s\S]*?)```/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI");
      }

      const MockJsonResponse = jsonMatch[1].trim();
      const JsonFeedbackResp = JSON.parse(MockJsonResponse);
      console.log(JsonFeedbackResp);

      if (JsonFeedbackResp) {
        const mockId = extractMockId();
        console.log("Using mockId for database:", mockId);

        const res = await db.insert(UserAnswer).values({
          mockIdRef: mockId,
          question: questionText,
          correctAns: JsonFeedbackResp?.correctAns || "N/A",
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback || "No feedback provided",
          rating: JsonFeedbackResp?.rating || "N/A",
          userEmail: user?.primaryEmailAddress?.emailAddress || "Unknown",
          createdAt: moment().format('YYYY-MM-DD'),
        });

        if (res) {
          console.log("Insert response:", res);
          toast.success("User answer recorded successfully!");
          setUserAnswer('')
          setResults([])
        } else {
          setResults([])
          toast.error("Failed to save the answer. Try again.");
        }
      } else {
        toast.error('Error saving the data');
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("An error occurred while saving your answer. Please try again.");
    } finally {
      setUserAnswer('');
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Your Response</h3>
      
      <div className="mb-6 relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
        <Webcam 
          mirrored={true} 
          className="w-full h-[280px] object-cover"
        />
        {isRecording && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm animate-pulse">
            <Mic className="h-3 w-3" />
            Recording
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {userAnswer && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Your current answer:</h4>
            <p className="text-gray-800">{userAnswer}</p>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            disabled={loading} 
            onClick={StartStopRecording}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
              isRecording 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isRecording ? (
              <>
                <StopCircle className="h-4 w-4" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>Record Answer</span>
              </>
            )}
          </Button>
        </div>
        
        {isRecording && (
          <div className="flex justify-center items-center gap-2 mt-2">
            <Waveform className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-sm text-red-500">Speak clearly into your microphone</span>
          </div>
        )}
        
        {loading && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center gap-2 mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing your answer...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordAnsSection;