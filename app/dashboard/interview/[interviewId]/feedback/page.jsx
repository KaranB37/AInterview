'use client'
import React, { useEffect, useState } from 'react'
import db from '../../../../../utils/db'
import { UserAnswer } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "../../../../../components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'



const Feedback = ({params}) => {

   const [feedbackList,setFeedbackList] = useState([]) 

useEffect(()=>{
    getFeedback()
},[])


    const  getFeedback=async()=>{
const result = await db.select()
.from(UserAnswer)
.where(eq(UserAnswer.mockIdRef,params.interviewId))
.orderBy(UserAnswer.id);
console.log(result)
setFeedbackList(result)
    }


  return (
    <div className='p-10'>
        <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview Feedback</h2>
      <h2 className='text-primary text-lg my-3'>Your Overall interview rating: <strong>7/10</strong></h2>
   <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvement</h2>
   
   {feedbackList&& feedbackList.map((item,index)=>(

            <Collapsible>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg
           flex justify-between my-2 text-left gap-10 w-full
            '>{item.question} 
            <ChevronsUpDown className='h-5 w-5'/>
            </CollapsibleTrigger>
            <CollapsibleContent>
            <div className='flex flex-col gap-2'>
                    <h2 className='text-red-500 p-2 border rounded-lg'> <strong>Rating:</strong>{item.rating}</h2>
                     <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: {item.userAns}</strong></h2>
                     <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Feedback for Answer: {item.feedback}</strong></h2>
                     
                      </div>
            </CollapsibleContent>
            </Collapsible>

   ))}
    </div>
  )
}

export default Feedback
