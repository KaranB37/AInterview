'use client'
import React, { useEffect, useState } from 'react'
import webcamimg from "./webcam.png"
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Button } from '../../../../../../components/ui/button';
import { Toaster  } from '../../../../../../components/ui/sonner';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import chatSession from '../../../../../../utils/GeminiAIModel';
import db from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';


export const RecordAnsSection = ({mockInterviewQuestion,activeQuestionIndex }) => {
const [userAnswer,setUserAnswer]=useState('')
const [loading,setLoading]= useState(false)
const {user} =useUser()
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(preAns=>preAns+result?.transcript)
        ))
              },[results])


const SaveUserAnswer =async()=>{
  if(isRecording){
    setLoading(true)
stopSpeechToText()
if(userAnswer?.length<10){
  setLoading(false)

toast('Error while saving your answer, Please record again')
  return;
}


const feedbackPrompt = "Question:"+mockInterviewQuestion[activeQuestionIndex]?.Question+
",User Answer: "+userAnswer+"Depends on question and user answers for given interview question"+
"please give us rating for answer and feedback as area of improment if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field and  and dont give any text just json reposne staring with ```json and ending with ``` in between there will be [  the data ] and this should not happen Unexpected non-whitespace character after JSON and please ensure Unexpected non-whitespace character after JSON at position 5212 (line 24 column 1) this type of error should occur";
  

const result=await chatSession.sendMessage(feedbackPrompt)
const MockJsonResponse=(result.response.text()).replace('```json','').replace('```','')
console.log(MockJsonResponse)
const JsonFeedbackResp=JSON.parse(MockJsonResponse)

const res = await db.insert(userAnswer)
    .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.correctAns,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
    });

    if(res){
      toast("User Answer recorded sucessfully")
    }
    setLoading(false)


}
  
  else{
startSpeechToText()
  }
}

  return (
    <div className='flex items-center justify-center flex-col'>
    <div className='ml-5 p-5 border rounded-lg mt-5 flex flex-col justify-center items-center g-10'>
<Image src={webcamimg} width={200} height={200} className='absolute'/>
     <Webcam
     mirrored={true}
     style={{
        height:300,
        width:'100%',
        zIndex:10

     }}/>
    </div>
    <Button disabled={loading} variant="outline" className="my-10 bg-black text-white cursor-pointer"
    onClick={SaveUserAnswer}
    >{isRecording ? <span><StopCircle/>Stop Recording</span> :<span>Record Answer</span>}</Button>
    
    {isRecording?
    <h2 className='text-red-600 flex gap-2 mb-5' >
        <Mic/> 'Recording....'
    </h2> : ''}

    <Button onClick={()=>console.log(userAnswer)}>Show Answer</Button>
    {/* <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul> */}
    </div>
  )
}

export default RecordAnsSection;
