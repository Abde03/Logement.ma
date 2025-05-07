import {useState, useContext} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CiFilter, CiUser } from "react-icons/ci";
import { SearchContext } from '../context/search-context';
import { UserContext } from '../context/user-context';


export default function Header() {
  const [isOpened, setIsOpened] = useState(false)
  const {user} = useContext(UserContext)
  const {setSearch, setFilter} = useContext(SearchContext)
  const {pathname} = useLocation()
  const isHomePage = (pathname === '/')

  return (
    <header className='flex justify-between items-center'>
      <a href="/" className='flex gap-1 items-center'>
        <img className='w-8' src='/morocco.png' />
        {/* {!isHomePage && (<span className='font-bold text-xl text-red-500'>Logement<span className='text-green-500'>.ma</span></span>)} */}
        <span className={`hidden sm:block font-bold text-xl text-red-500`}>Logement<span className='text-green-500'>.ma</span></span>
      </a>
      { isHomePage &&
      <div className='flex-1 max-w-xl mx-4 relative'>
        <div className='relative'>
          <input type="text" placeholder='Find accommodation'
          onChange={(e) => setSearch(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:outline-none focus:ring-red-500 ' />
        </div>
        <div className='absolute right-2 top-2.5'>
          <button 
          onClick={() => setIsOpened(!isOpened)}
          className='p-1.5 rounded-full focus:outline-none hover:ring-2 hover:ring-red-500 '>
            <CiFilter strokeWidth={1.5} className='text-green-500' />
          </button>
          {
            isOpened && (
              <div className='absolute right-0 mt-2 py-2 bg-white w-48 rounded-md shadow-xl z-20'>
                <div onClick={()=> {setFilter('desc') , setIsOpened(!isOpened)}} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Price: High to Low</div>
                <div onClick={()=> {setFilter('asc') , setIsOpened(!isOpened)} }  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Price: Low to High</div>
              </div>
            )
          }
        </div>
      </div>}    
      <Link to={user ? '/profile' : '/login'} className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">
          {user ? (
            <div className="rounded-full border-gray-300 p-1 overflow-hidden flex gap-1">
              {user.name[0].toUpperCase()}
            </div>
          ) : 
          <div className="rounded-full border-gray-300 p-1 overflow-hidden flex gap-1">
            <CiUser strokeWidth={1.5} className='text-green-500' />
          </div>
        }
      </Link>
     </header>
  )
}
