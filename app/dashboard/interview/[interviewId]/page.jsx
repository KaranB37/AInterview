'use client'
import React, { useEffect, useState } from 'react'
import db from '../../../../utils/db'
import MockInterview from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon, Loader2, AlertCircle, ArrowRight, FileText, Briefcase, Clock } from 'lucide-react'
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
        <div className='container mx-auto px-4 py-10 max-w-6xl'>
            <div className='mb-8'>
                <h2 className='font-bold text-3xl text-gray-800 mb-2'>Let's Get Started</h2>
                <p className='text-gray-600'>Prepare for your interview session</p>
            </div>
            
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading interview details...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-800 font-medium mb-1">Error</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='flex flex-col space-y-4'>
                        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                            <h3 className='font-medium text-lg text-gray-800 mb-4'>Camera Preview</h3>
                            {webCamE ? (
                                <div className='relative rounded-lg overflow-hidden bg-gray-50'>
                                    <Webcam 
                                        mirrored={true}
                                        audio={true}
                                        onUserMedia={handleUserMedia}
                                        onUserMediaError={handleUserMediaError}
                                        className='w-full h-[300px] object-cover rounded-lg'
                                    />
                                    <div className='absolute bottom-3 right-3'>
                                        <div className='h-3 w-3 bg-green-500 rounded-full animate-pulse'></div>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center'>
                                    <div className='bg-blue-50 rounded-lg p-8 mb-4 w-full flex justify-center'>
                                        <WebcamIcon className='h-32 w-32 text-blue-300' />
                                    </div>
                                    <Button 
                                        onClick={() => setWebCamE(true)} 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <WebcamIcon className="h-4 w-4" />
                                        Enable Camera & Microphone
                                    </Button>
                                </div>
                            )}
                        </div>
                        
                        <div className='bg-amber-50 border border-amber-200 rounded-xl p-6'>
                            <div className='flex items-center gap-2 mb-3'>
                                <Lightbulb className='h-5 w-5 text-amber-500' />
                                <h3 className='font-medium text-amber-700'>Important Information</h3>
                            </div>
                            <p className='text-amber-800 text-sm'>{process.env.NEXT_PUBLIC_INFORMATION || "Speak clearly and face the camera for the best experience. Your interview will be recorded for review purposes."}</p>
                        </div>
                    </div>

                    {interviewData && (
                        <div className='flex flex-col space-y-6'>
                            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                                <h3 className='font-medium text-lg text-gray-800 mb-5'>Interview Details</h3>
                                
                                <div className='space-y-5'>
                                    <div className='flex items-start gap-3 pb-4 border-b border-gray-100'>
                                        <Briefcase className='h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0' />
                                        <div>
                                            <p className='text-sm text-gray-500 mb-1'>Job Role/Position</p>
                                            <p className='font-medium text-gray-800'>{interviewData.jobPosition}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3 pb-4 border-b border-gray-100'>
                                        <FileText className='h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0' />
                                        <div>
                                            <p className='text-sm text-gray-500 mb-1'>Job Description/Tech Stack</p>
                                            <p className='text-gray-800'>{interviewData.jobDesc}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3'>
                                        <Clock className='h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0' />
                                        <div>
                                            <p className='text-sm text-gray-500 mb-1'>Years of Experience</p>
                                            <p className='font-medium text-gray-800'>{interviewData.jobExperience}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <Link href={`/dashboard/interview/${params.interviewId}/start`} className='w-full'>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg text-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg">
                                    Start Interview
                                    <ArrowRight className="h-5 w-5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Interview;