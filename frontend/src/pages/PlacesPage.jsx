import React from 'react'
import { useState , useEffect } from 'react'
import { Link } from 'react-router-dom'
import Image from '../components/image'
import AccountNav from '../components/AccountNav'
import axios from 'axios';
import { useSelector } from 'react-redux';



export default function PlacesPage() {

  const {CurrentUser} = useSelector(state => state.user);

  
  
  const [places,setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/place/user', { params: { userID: CurrentUser._id } }
    ).then(response => {
      setPlaces(response.data);
    });
  }, []);
  
  
 

  return (
    <div>
      <AccountNav />
        <div className=' p-8 text-center'>
            <Link to='/profile/places/new' className=' inline-flex gap-1 bg-primary text-white py-3 px-6 rounded-full  '>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ajouter un nouveau lieu
            </Link>
        </div>
        <div className='mt-4'>
          {places.length > 0 && places.map((place, index) => (
            <Link to={'/profile/places/'+place._id} className='flex cursor-pointer items-center gap-4 bg-slate-100 p-4 rounded-2xl mt-2'>
              <div className='flex w-32 h-32 bg-gray-300 grow shrink-0'>
                {place.images.length > 0 && (
                  <Image className = "object-cover" src={place.images[0]} alt={place.title} />
                )}
              </div>
              <div className='grow-0 shrink'>
                <h2 className='text-xl'>{place.title}</h2>
                <p className='text-sm mt-2'>{place.description}</p>
              </div>
            </Link>
          ))}
        </div>
    </div>
  )
}
