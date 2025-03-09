'use client'
import React, { useEffect, useState } from 'react'
import db from '../../../../../utils/db';
import MockInterview from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import QuestionSection from "../start/_components/QuestionSection"
import RecordAnsSection from "../start/_components/RecordAnsSection"
import { Button } from '../../../../../components/ui/button';
const Start = ({params}) => {

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewData] = useState();
const [activeQuestionIndex,setActiveQuestionIndex]= useState(0)

    useEffect(()=>{
        GetInterviewDetails()
    },[])

    const GetInterviewDetails = async () => {
        // try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
       
       const jsonMockResp=JSON.parse(result[0].jsonMockResp)
       console.log(jsonMockResp)
       setMockInterviewData(jsonMockResp)
       setInterviewData(jsonMockResp)
            //     if (result.length > 0) {
        //         setInterviewData(result[0]);
        //     } else {
        //         setError("No interview data found.");
        //     }
        // } catch (err) {
        //     console.error("Error fetching data:", err);
        //     setError("Failed to fetch interview details. Please try again later.");
        // } finally {
        //     setLoading(false);
        // }
    };


  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* questions  */}

            <QuestionSection mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex} />
            {/* audio recording  */}
            <RecordAnsSection mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex} />
            </div>
            <div className='flex justify-end gap-6 mb-14'>
           { activeQuestionIndex > 0 &&  <>  <Button onClick={()=> setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button></>}
           {activeQuestionIndex != mockInterviewQuestion?.length-1 &&     <Button onClick={()=> setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            { activeQuestionIndex == mockInterviewQuestion?.length-1 &&    <Button>End Interview</Button>}
            </div>
    </div>
  )
}

export default Start
