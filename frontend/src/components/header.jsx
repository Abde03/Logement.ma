import React from 'react'
import { Link } from 'react-router-dom'
import { CiFilter, CiUser } from "react-icons/ci";
import { useSelector } from 'react-redux';
import { SearchContext } from '../context';


export default function Header() {
  const [isOpened, setIsOpened] = React.useState(false)
  const {CurrentUser} = useSelector(state => state.user)
  const {setSearch, setFilter} = React.useContext(SearchContext)
  return (
    <header className='flex justify-between'>
      <a href="/" className='flex gap-1 items-center'>
        <img className='w-8' src='/morocco.png' />
        <span className='font-bold text-xl text-red-500'>Logement<span className='text-green-500'>.ma</span></span>
      </a>

      <div className='flex-1 max-w-xl mx-4 relative'>
        <div className='relative'>
          <input type="text" placeholder='Chercher un logement'
          onChange={(e) => setSearch(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:outline-none focus:ring-red-500 ' />
        </div>
        <div className='absolute right-2 top-2.5'>
          <button 
          onClick={() => setIsOpened(!isOpened)}
          className='p-1.5 rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'>
            <CiFilter strokeWidth={1.5} className='text-green-500' />
          </button>
          {
            isOpened && (
              <div className='absolute right-0 mt-2 py-2 bg-white w-48 rounded-md shadow-xl z-20'>
                <div onClick={()=> {setFilter('desc') , setIsOpened(!isOpened)}} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Prix : Haut à Bas</div>
                <div onClick={()=> {setFilter('asc') , setIsOpened(!isOpened)} }  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Prix : Bas à Haut</div>
              </div>
            )
          }
        </div>
      </div>
      
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
