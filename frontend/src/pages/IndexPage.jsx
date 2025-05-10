import {useState , useEffect, useContext} from 'react'
import axios from 'axios';
import Image from '../components/image';
import {SearchContext} from '../context/search-context';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';

export default function IndexPage() {
  const  [places , setPlaces] = useState([]);
  const {search, filter} = useContext(SearchContext);
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const {data} = await axios.get('/place');
        setPlaces(data.places);
      } catch (error) {
        toast.error('Error fetching places');
      }
    };
    fetchPlaces();
    },[]);
    
    const filteredData = places.length>0 ? places.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
      if (filter === 'asc') {
        return a.price - b.price;
      } else if (filter === 'desc') {
        return b.price - a.price;
      }
      return 0;
    }) : [];

  if (filteredData.length === 0 && filteredData !== undefined) {
    return (
      <div className='text-gray-500 mt-10 flex flex-col grow items-center justify-center'>
        <h2 className='text-2xl'>No accommodation found</h2>
        <p className='text-sm'>Try adding another search criteria</p>
      </div>
    );
  }
  return (
    <>
      
      <div className='grid gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 grow mt-8'>
        {
          filteredData.length > 0 && filteredData.map((place, key) => (
            <Link key={key} to={'/place/'+place._id}>
              <div className='bg-gray-500 mb-2 rounded-2xl flex'>
              {place.images?.[0] && (
                <Image className = 'rounded-2xl  aspect-square object-cover ' src={place.images[0]} />
              )}
              </div>
              <h2 className='font-bold'>{place.title}</h2>
              <h3 className='text-sm text-gray-500'>{place.adress}</h3>
              <div className='mt-1'><span className='font-bold'>{place.price}DH</span> for night</div>
            </Link>
          )) 
        }
      </div>
    </>
  )
}
