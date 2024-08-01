import React , {useState , useEffect} from 'react'
import axios from 'axios';
import Image from '../components/image';
import { CiSearch , CiUser } from "react-icons/ci";

import { Link } from 'react-router-dom';

export default function IndexPage() {
  const  [places , setPlaces] = useState([]);
  const [search , setSearch] = useState('')
  useEffect(() => {
    axios.get('/place').then(res => {  
      setPlaces(res.data);
    });
    },[]);
    const filteredData = places.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );


  return (
    <>
      <div className="flex mt-8 border border-gray-400 rounded-full gap-3 py-1 items-center px-3 shadow-md shadow-gray-300 left-2">
        <div className='text-center'>Recherchez</div>
        <div className='shadow-gray-400'></div>
        <input value={search} onChange={(e) => setSearch(e.target.value)}  type="text" />    
      </div>
    <div className='grid gap-x-6 gap-y-8  lg:grid-cols-3 sm:grid-cols-2 mt-8'>
      {
        filteredData.map(place => (
          <Link to={'/place/'+place._id}>
            <div className='bg-gray-500 mb-2 rounded-2xl flex'>
            {place.images?.[0] && (
              <Image className = 'rounded-2xl  aspect-square object-cover ' src={place.images[0]} />
            )}
            </div>
            <h2 className='font-bold'>{place.title}</h2>
            <h3 className='text-sm text-gray-500'>{place.adress}</h3>
            <div className='mt-1'><span className='font-bold'>DH{place.price}</span> pour nuit</div>
          </Link>
        ))
      }
    </div>
            </>
  )
}
