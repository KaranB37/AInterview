import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from "../dashboard/_components/AddNewInterview" 
import Link from 'next/link'

const Dashboard = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-medium text-gray-900">Interview Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Create and manage your AI interview sessions to practice for your next job opportunity.
          </p>
        </div>
        
        <div className="mt-10">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Create New Interview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Set up a new AI-powered interview practice session
                </p>
              </div>
              <div className="px-6 py-5 sm:px-8">
                <AddNewInterview/>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Candidate Management</h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all interview candidates
                </p>
              </div>
              <div className="px-6 py-5 sm:px-8">
                <Link href="/dashboard/admin">
                  <button className="inline-flex items-center justify-center rounded-md py-2.5 px-5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    View All Candidates
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
