'use client'
import React, { useEffect, useState } from 'react'
import db from '../../../../../utils/db';
import MockInterview from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import QuestionSection from "./_components/QuestionSection"
import RecordAnsSection from "./_components/RecordAnsSection"
import { Button } from '../../../../../components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';

const Start = ({params}) => {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewData] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [result, setResult] = useState();
    const [mockId, setMockId] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMockId(params.interviewId);
        GetInterviewDetails();
    }, [params.interviewId]);

    const GetInterviewDetails = async () => {
        setLoading(true);
        try {
            const resmm = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
            setResult(resmm);
            console.log(resmm);
            const jsonMockResp = JSON.parse(resmm[0].jsonMockResp);
            console.log(jsonMockResp);
            setMockInterviewData(jsonMockResp);
            setInterviewData(jsonMockResp);
        } catch (error) {
            console.error("Error fetching interview data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading your interview questions...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Interview Session</h1>
                <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Question {activeQuestionIndex + 1} of {mockInterviewQuestion?.length || 0}
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
                {/* questions section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <QuestionSection 
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData}
                        result={result}
                    />
                </div>
                
                {/* recording section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <RecordAnsSection 
                        mockInterviewQuestion={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData}
                        result={result}
                    />
                </div>
            </div>
            
            <div className='flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8'>
                <div>
                    {activeQuestionIndex > 0 && (
                        <Button 
                            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                            className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous Question
                        </Button>
                    )}
                </div>
                
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center space-x-1">
                        {mockInterviewQuestion && mockInterviewQuestion.map((_, index) => (
                            <div 
                                key={index}
                                className={`h-2 w-2 rounded-full ${
                                    index === activeQuestionIndex 
                                        ? 'bg-blue-600' 
                                        : index < activeQuestionIndex 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                
                <div>
                    {activeQuestionIndex !== mockInterviewQuestion?.length - 1 ? (
                        <Button 
                            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                        >
                            Next Question
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Link href={`/dashboard/interview/${mockId}/feedback`}>
                            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1">
                                Complete Interview
                                <CheckCircle className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Start
