import {useState , useEffect, useContext} from 'react'
import axios from 'axios';
import Image from '../components/image';
import {SearchContext} from '../context';

import { Link } from 'react-router-dom';

export default function IndexPage() {
  const  [places , setPlaces] = useState([]);
  const {search, filter} = useContext(SearchContext);
  
  useEffect(() => {
    axios.get('/place').then(res => {  
      setPlaces(res.data);
    });
    },[]);
    const filteredData = places.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
      if (filter === 'asc') {
        return a.price - b.price;
      } else if (filter === 'desc') {
        return b.price - a.price;
      }
      return 0;
    });


  return (
    <>
      
      <div className='grid gap-x-6 gap-y-8  lg:grid-cols-3 sm:grid-cols-2 mt-8'>
        {
          filteredData.map((place, key) => (
            <Link key={key} to={'/place/'+place._id}>
              <div className='bg-gray-500 mb-2 rounded-2xl flex'>
              {place.images?.[0] && (
                <Image className = 'rounded-2xl  aspect-square object-cover ' src={place.images[0]} />
              )}
              </div>
              <h2 className='font-bold'>{place.title}</h2>
              <h3 className='text-sm text-gray-500'>{place.adress}</h3>
              <div className='mt-1'><span className='font-bold'>{place.price}DH</span> pour nuit</div>
            </Link>
          ))
        }
      </div>
    </>
  )
}
