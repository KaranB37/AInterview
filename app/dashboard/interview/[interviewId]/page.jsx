'use client'
import React, { useEffect, useState } from 'react'
import db from '../../../../utils/db'
import MockInterview from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import Link from 'next/link'

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState(null);
    const [webCamE, setWebCamE] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(params.interviewId)
        if (params?.interviewId) {
            GetInterviewDetails();
        }
    }, [params?.interviewId]);

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
            if (result.length > 0) {
                setInterviewData(result[0]);
            } else {
                setError("No interview data found.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch interview details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserMedia = () => {
        setWebCamE(true);
    };

    const handleUserMediaError = () => {
        console.error("Error accessing webcam");
        setWebCamE(false);
    };

    return (
        <div className='my-10 '>
            <h2 className='font-bold text-2xl pb-2'>Let's Get Started</h2>
            {loading ? (
                <p>Loading interview details...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className='grid grid-col-1 md:grid-cols-2'>
                    <div>
                        {webCamE ? (
                            <Webcam 
                                mirrored={true}
                                audio={true}
                                onUserMedia={handleUserMedia}
                                onUserMediaError={handleUserMediaError}
                                style={{ height: 300, width: 300 }}
                            />
                        ) : (
                            <>
                                <WebcamIcon className='h-72 w-full p-20 bg-secondary rounded-lg border' />
                                <Button onClick={() => setWebCamE(true)} className="mt-2 w-full">Enable Web Cam and Microphone</Button>
                            </>
                        )}
                    </div>
                    {interviewData && (
                        <div className='flex flex-col my-5  '>
                           <div className='flex flex-col gap-5 p-5 rounded-lg border gap-5'>
                            <h2><strong>Job Role/Job Position:</strong> {interviewData.jobPosition}</h2>
                            <h2><strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}</h2>
                            <h2><strong>Year of Experience:</strong> {interviewData.jobExperience}</h2>
                        </div>


                        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100' >

                        <h2 className='flex gap-2 items-center color text-yellow-500'><Lightbulb/>
                            <span>Information</span></h2>
                    <h2 className='mt-3 '>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                            </div>
                        </div>
                    )}
                        

                </div>
            )}
            <div className='flex justify-end items-end'>
                       <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                        <Button>Start Interview</Button>
                        </Link>
                        </div>
        </div>

    );
};

export default Interview;