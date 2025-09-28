import {useEffect , useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import AddressLink from '../components/AddressLink';
import BookingWidg from '../components/BookingWidg';
import Image from '../components/image';
import { FaRegImages } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';


export default function PlacePage() {
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos,setShowAllPhotos] = useState(false);

    useEffect(() => {
        const fetchPlaces = async () => {
          try {
            if(!id) return (toast.error('id not found'));
            const {data} = await axios.get('/place/'+id);
            if (data.success) {
              const place = data.data?.place || data.place;
              setPlace(place);
            }else{
              toast.error(data.message);
            }
          } catch (error) {
            toast.error(error.response?.data?.message || error.message)
          }
        }
        fetchPlaces();
    }, [id]);

    const formatDate = (date) => {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      return formattedDate;
    };

    if(!place) return 'loading...';

    if(showAllPhotos) {
      return (
        <div className='absolute inset-0 bg-white dark:bg-gray-800 min-h-screen z-50'>
          <div className='p-4 sm:p-6 lg:p-8 grid gap-4'>
            <div className="flex justify-between items-start">
              <h2 className='text-xl sm:text-2xl lg:text-3xl font-semibold pr-4'>Photos of {place.title}</h2>
              <button onClick={() => setShowAllPhotos(false)} className='flex p-2 gap-1 items-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors flex-shrink-0'>
                <IoMdClose className="text-lg"/>
                <span className="hidden sm:inline">Retour</span>
              </button>
            </div>
          {
            place?.images?.length > 0 && place.images.map((photo, index) => (
              <div key={index} className="w-full max-w-4xl mx-auto">
                <Image src={photo} alt={`Photo ${index + 1} of ${place.title}`} className="w-full h-auto rounded-lg" />
              </div>
            ))
           }
          </div>
        </div>
      )}


  return (
    <div className='grow pt-4 mb-8'>
    { place!==null && (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 sm:p-6 lg:p-8 rounded-xl">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <div className='relative'>
        <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr] rounded-3xl overflow-hidden'>
          <div>
            {place.images?.[0] && (
                  <div>
                    <Image onClick={() => setShowAllPhotos(true)} className='aspect-square sm:aspect-video md:aspect-square object-cover cursor-pointer' src={place.images[0]} />
                  </div>
            )}
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-1 gap-2'>
            {place.images?.[1] && (
                    <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover cursor-pointer' src={place.images[1]} />
            )}
            <div className='overflow-hidden'>
            {place.images?.[2] && (
                  <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover relative sm:top-2 cursor-pointer' src={place.images[2]} />
            )}
            </div>
          </div>
        </div>
        <button onClick={() => setShowAllPhotos(true)} className='flex gap-1 items-center absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500 text-sm sm:text-base'> <FaRegImages/>
          <span className='hidden sm:inline'>Afficher Plus</span>
          <span className='sm:hidden'>Plus</span>
        </button>
      </div>
      <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className=""> 
            <h2 className="font-semibold text-xl sm:text-2xl mb-2">Description</h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{place.description}</p>
          </div>
          <div>
            <h2 className='font-semibold text-xl sm:text-2xl mb-2'>Availability</h2>
            <div className="space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <p>From : {formatDate(place.checkIn)}</p>
              <p>To : {formatDate(place.checkOut)}</p>
              <p>Max guests : {place.maxGuests}</p>
            </div>
          </div>  
        </div>
        <div className="order-first lg:order-last">
          <BookingWidg place={place}/>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-3">More info</h2>
        </div>
        <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{place.extraInfo}</div>
      </div>
    </div>
    ) 
    }
    </div>
  )
}
