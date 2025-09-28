import {useState , useEffect, useContext} from 'react'
import axios from 'axios';
import Image from '../components/image';
import {SearchContext} from '../context/search-context';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlaceGridSkeleton } from '../components/SkeletonLoaders';

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const {search, filter} = useContext(SearchContext);
  
  // Debounce search to avoid excessive filtering
  const debouncedSearch = useDebounce(search, 300);
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const {data} = await axios.get('/place');
        // Handle new response format with data wrapper
        setPlaces(data.data?.places || data.places || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching places');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };
    fetchPlaces();
  }, []);
    
  const filteredData = places.length > 0 ? places.filter(item =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.address?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ).sort((a, b) => {
    if (filter === 'asc') {
      return a.price - b.price;
    } else if (filter === 'desc') {
      return b.price - a.price;
    }
    return 0;
  }) : [];

  // Show skeleton on initial load
  if (initialLoad && loading) {
    return <PlaceGridSkeleton count={6} />;
  }

  // Show loading spinner for subsequent loads
  if (loading && !initialLoad) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (filteredData.length === 0 && places.length > 0) {
    return (
      <div className='text-gray-500 dark:text-gray-400 mt-10 flex flex-col grow items-center justify-center'>
        <h2 className='text-2xl text-gray-700 dark:text-gray-300'>No accommodation found</h2>
        <p className='text-sm'>Try adding another search criteria</p>
      </div>
    );
  }

  if (places.length === 0 && !loading) {
    return (
      <div className='text-gray-500 dark:text-gray-400 mt-10 flex flex-col grow items-center justify-center'>
        <h2 className='text-2xl text-gray-700 dark:text-gray-300'>No accommodations available</h2>
        <p className='text-sm'>Check back later for new listings</p>
      </div>
    );
  }

  return (
    <>
      <div className='grid gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 grow mt-8'>
        {
          filteredData.length > 0 && filteredData.map((place, key) => (
            <Link key={place._id || key} to={'/place/'+place._id}>
              <div className='bg-gray-500 mb-2 rounded-2xl flex transition-transform duration-200 hover:scale-105'>
              {place.images?.[0] && (
                <Image className='rounded-2xl aspect-square object-cover' src={place.images[0]} />
              )}
              </div>
              <h2 className='font-bold truncate text-gray-900 dark:text-gray-100'>{place.title}</h2>
              <h3 className='text-sm text-gray-500 dark:text-gray-400 truncate'>{place.address || place.adress}</h3>
              <div className='mt-1 text-gray-800 dark:text-gray-200'>
                <span className='font-bold'>{place.price}DH</span> per night
              </div>
            </Link>
          )) 
        }
      </div>
    </>
  )
}
