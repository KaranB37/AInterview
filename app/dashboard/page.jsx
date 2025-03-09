import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from "../dashboard/_components/AddNewInterview" 
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
    </div>
  )
}

export default Dashboard
