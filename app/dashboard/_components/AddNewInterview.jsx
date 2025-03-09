'use client'
import React, { useState } from 'react'
import { Button } from "../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
 import db from "../../../utils/db"
 import MockInterview from "../../../utils/schema"
//  import db from "../../../utils/"
import chatSession from "../../../utils/GeminiAIModel"
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const AddNewInterview = () => {
  const {user} = useUser()
  const router=useRouter()
    const [openDialog,setOpenDialog]= useState(false)
    const [jb,setjb]= useState()
    const [jd,setjd]= useState()
    const [je,setje]= useState()
    const [loading,setLoading]= useState()
    const [jsonResponse,setJsonResponse]= useState([])
    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        console.log(jb,jd,je)
        const inputPrompt = "Job Position:"+jb+"Job Description:"+jd+" Years of Experience: "+je+" Depends on this information please give me 5 Interview question with Answered in Json Format, Give Question and Answered as field in JSON and dont give any text just json reposne staring with ```json and ending with ``` in between there will be [  the data ] and this should not happen Unexpected non-whitespace character after JSON and please ensure Unexpected non-whitespace character after JSON at position 5212 (line 24 column 1) this type of error should occur"
        const result = await chatSession.sendMessage(inputPrompt)
       const MockJsonResponse=(result.response.text()).replace('```json','').replace('```','')
       console.log(JSON.parse(MockJsonResponse))
       setJsonResponse(JSON.parse(MockJsonResponse))
        // console.log(result.response.text())
        if(MockJsonResponse){
        const response = await db.insert(MockInterview).values({
          mockId:uuidv4(),
          jsonMockResp:MockJsonResponse,
          jobDesc:jd,
          jobExperience:je,
          jobPosition:jb,
          createdBy:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId})
        console.log("Inserted ID:", response)
if(response){
  setOpenDialog(false)
  router.push('./dashboard/interview/'+response[0]?.mockId)
}
      }else{
        console.log("error adding data in db")
      }

        setLoading(false)

    }
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary
      hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      
      onClick={()=> setOpenDialog(true)}>
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog} className='max-w-xl'>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Tell us more about your job interviewing</DialogTitle>
          <DialogDescription>


<form onSubmit={onSubmit}>

            <div>

                <h2>Add Details about your job position/role, Job Description and years of experience</h2>
         
         <div className='mt-7 my-2'>
<Label className="mb-2">Job Role/Job Position</Label>
<Input placeholder="Ex. Full Stack Developer" required 
onChange={(event)=>setjb(event.target.value)}/>
         </div>
    
    
         <div className='my-3'>
    <Label className="mb-2">Job Description/ Tech Stack</Label>
         <Textarea placeholder="Type your message here." 
         onChange={(event)=>setjd(event.target.value)}/>
         </div>
           
         <div className='my-3'>
    <Label className="mb-2">Year of experience</Label>
         <Input placeholder="Ex. 5" type="number" max="100"
         onChange={(event)=>setje(event.target.value)}/>
         </div>
           

            </div>
            <div className='flex gap-5 justify-end'>
        <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>  Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? <>Generating From AI</>:<>Start Interview</> }</Button>
        </div>
            </form>

       


        </DialogDescription>
        
        </DialogHeader>
        
          
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default AddNewInterview
