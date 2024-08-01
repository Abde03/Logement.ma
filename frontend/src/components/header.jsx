import React from 'react'
import { Link } from 'react-router-dom'
import { CiSearch , CiUser } from "react-icons/ci";
import { useSelector } from 'react-redux';


export default function Header() {
  const {CurrentUser} = useSelector(state => state.user)
  return (
    <header className='flex justify-between'>
      <a href="/" className='flex gap-1 items-center'>
        <img className='w-8' src='../../public/morocco.png' />
        <span className='font-bold text-xl text-red-500'>Logement<span className='text-green-500'>.ma</span></span>
      </a>
      
      <Link to={CurrentUser ? '/profile' : '/login'} className=" items-center flex border border-gray-400 rounded-full gap-2 py-2  px-4 shadow-md shadow-gray-300">
        <div className="bg-gray-500 rounded-full border-gray-300 p-1 overflow-hidden flex gap-1 group">
          <CiUser strokeWidth={1.5} className="text-white w-6 h-6 relative  " />
          {CurrentUser ? (
            <span className='bg-white rounded-full px-1'>
              {CurrentUser.name}
            </span>
          ) : null }
        </div>
      </Link>
     </header>
  )
}
