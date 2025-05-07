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
            const {place} = data;
            if (data.success) {
              setPlace(place);
            }else{
              toast.error(data.message);
            }
          } catch (error) {
            toast.error(error.message)
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
        <div className='absolute inset-0 bg-white min-h-screen'>
          <div className='p-8 grid gap-4 '>
            <div>
              <h2 className='text-3xl mr-48'>Photos of {place.title}</h2>
              <button onClick={() => setShowAllPhotos(false)} className='fixed right-12 top-8 flex p-2 gap-1 items-center rounded-xl bg-primary text-white'>
                <IoMdClose/>
                Retour
              </button>
            </div>
          {
            place?.images?.length > 0 && place.images.map( photo => (
              // eslint-disable-next-line react/jsx-key
              <div>
                <Image src={photo} alt="" />
              </div>
            ))
           }
          </div>
        </div>
      )}


  return (
    <> 
    { place!==null && (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <div className='relative'>
        <div className='grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden'>
          <div>
            {place.images?.[0] && (
                  <div>
                    <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover' src={place.images[0]} />
                  </div>
            )}
          </div>
          <div className='grid'>
            {place.images?.[1] && (
                    <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover' src={place.images[1]} />
            )}
            <div className='overflow-hidden'>
            {place.images?.[2] && (
                  <Image onClick={() => setShowAllPhotos(true)} className='aspect-square object-cover relative top-2' src={place.images[2]} />
            )}
            </div>
          </div>
        </div>
        <button onClick={() => setShowAllPhotos(true)} className='flex gap-1 items-center absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500'> <FaRegImages/>Afficher Plus</button>
      </div>
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-2">
          <div className=""> 
            <h2 className="font-semibold text-2xl">Description</h2>
            <p>{place.description}</p>
          </div>
          <div>
            <h2 className='font-semibold text-2xl'>Availability</h2>
            <p>From : {formatDate(place.checkIn)}<br /></p>
            <p>To : {formatDate(place.checkOut)}<br /></p>
            <p>Max guests : {place.maxGuests}</p>
          </div>  
        </div>
        <div>
          <BookingWidg place={place}/>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">More info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
      </div>
    </div>
    ) 
    }
    </>
  )
}
