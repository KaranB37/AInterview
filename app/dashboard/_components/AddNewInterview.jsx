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
import chatSession from "../../../utils/GeminiAIModel"
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const AddNewInterview = () => {
  const {user} = useUser()
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [jb, setjb] = useState()
  const [jd, setjd] = useState()
  const [je, setje] = useState()
  const [loading, setLoading] = useState()
  const [jsonResponse, setJsonResponse] = useState([])
  
  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    console.log(jb,jd,je)
    const inputPrompt = "Job Position:"+jb+"Job Description:"+jd+" Years of Experience: "+je+" Depends on this information please give me 5 Interview question with Answered in Json Format, Give Question and Answered as field in JSON and dont give any text just json reposne staring with ```json and ending with ``` in between there will be [  the data ] and this should not happen Unexpected non-whitespace character after JSON and please ensure Unexpected non-whitespace character after JSON at position 5212 (line 24 column 1) this type of error should occur"
    const result = await chatSession.sendMessage(inputPrompt)
    const MockJsonResponse = (result.response.text()).replace('```json','').replace('```','')
    console.log(JSON.parse(MockJsonResponse))
    setJsonResponse(JSON.parse(MockJsonResponse))
    
    if(MockJsonResponse){
      const response = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResponse,
        jobDesc: jd,
        jobExperience: je,
        jobPosition: jb,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning({mockId: MockInterview.mockId})
      
      console.log("Inserted ID:", response)
      
      if(response){
        setOpenDialog(false)
        router.push('./dashboard/interview/'+response[0]?.mockId)
      }
    } else {
      console.log("error adding data in db")
    }
    
    setLoading(false)
  }
  
  return (
    <div>
      <div 
        className="group relative rounded-2xl bg-gradient-to-b from-gray-50 to-white p-6 transition-all hover:shadow-md border border-gray-100 hover:border-blue-100 cursor-pointer overflow-hidden"
        onClick={() => setOpenDialog(true)}
      >
        <div className="flex flex-col items-center justify-center text-center h-40">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Create New Interview</h3>
          <p className="mt-2 text-sm text-gray-500">Set up a tailored AI interview practice session</p>
        </div>
      </div>
      
      <Dialog open={openDialog}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-medium text-gray-900">New AI Interview</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mt-2">
              Let us know about the position you're interviewing for to generate tailored questions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-1.5">Job Role/Position</Label>
                  <Input 
                    placeholder="Ex. Full Stack Developer" 
                    required 
                    onChange={(event)=>setjb(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-1.5">Job Description/Tech Stack</Label>
                  <Textarea 
                    placeholder="Describe the job requirements, responsibilities, and relevant technologies..." 
                    onChange={(event)=>setjd(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-1.5">Years of Experience</Label>
                  <Input 
                    placeholder="Ex. 5" 
                    type="number" 
                    max="100"
                    onChange={(event)=>setje(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 py-4 border-t border-gray-100 bg-gray-50 px-6 -mx-6 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={()=>setOpenDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating AI Questions
                    </div>
                  ) : "Start Interview"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview
