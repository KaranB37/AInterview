import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from "../dashboard/_components/AddNewInterview" 
import Link from 'next/link'

const Dashboard = () => {
  return (
    <div className='p-10'>
      {/* Dashboard
      <UserButton/> */}
    <h2 className='font-bold text=2xl'>Dashboard</h2>
    <h2 className='text-gray-500'>Create and Start your AI Interview</h2>
   <div>

    <AddNewInterview/>
   </div>
   <div className='mt-5'>
    <Link href="/dashboard/admin">
      <button className='bg-blue-500 text-white px-4 py-2 rounded'>View Candidates</button>
    </Link>
   </div>
    </div>
  )
}

export default Dashboard
