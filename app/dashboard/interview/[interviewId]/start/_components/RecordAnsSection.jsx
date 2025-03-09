'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Button } from '../../../../../../components/ui/button';
import { toast } from 'sonner';
import { Mic, StopCircle } from 'lucide-react';
import useSpeechToText from 'react-hook-speech-to-text';
import chatSession from '../../../../../../utils/GeminiAIModel';
import { UserAnswer } from '../../../../../../utils/schema'; // Import UserAnswer schema directly
import { db } from '../../../../../../utils/db'; // Make sure to import db properly
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter, usePathname } from 'next/navigation';
import webcamimg from "./webcam.png";

export const RecordAnsSection = ({ mockInterviewQuestion, activeQuestionIndex,interviewData }) => {
  console.log(interviewData)
  const router = useRouter();
  const pathname = usePathname();
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const {user}   = useUser();

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
    console.log("User Data",user)
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
    <div className='flex items-center justify-center flex-col'>
      <div className='ml-5 p-5 border rounded-lg mt-5 flex flex-col justify-center items-center g-10'>
        <Image src={webcamimg} width={200} height={200} className='absolute'/>
        <Webcam mirrored={true} style={{ height: 300, width: '100%', zIndex: 10 }}/>
      </div>

      <Button 
        disabled={loading} 
        variant="outline" 
        className="my-10 bg-black text-white cursor-pointer" 
        onClick={StartStopRecording}
      >
        {isRecording 
          ? <span className='flex justify-center items-center gap-2'><StopCircle/> Stop Recording</span> 
          : <span>Record Answer</span>}
      </Button>

      {isRecording && <h2 className='text-red-600 flex gap-2 mb-5'><Mic/> Recording...</h2>}
    </div>
  );
};

export default RecordAnsSection;