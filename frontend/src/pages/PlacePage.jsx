import React , {useEffect , useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import AddressLink from '../components/AddressLink';
import BookingWidg from '../components/BookingWidg';
import Image from '../components/image';
import { FaRegImages } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";


export default function PlacePage() {
    const {id} = useParams();
    const [place, setPlace] = useState([]);
    const [showAllPhotos,setShowAllPhotos] = useState(false);

    useEffect(() => {
        if(!id) return;
        axios.get('/place/'+id).then(res => {
            setPlace(res.data);
            console.log(res.data);
        });

        console.log(id);
    }, [id])

    if(!place) return 'loading...';

    if(showAllPhotos) {
      return (
        <div className='absolute inset-0 bg-white min-h-screen'>
          <div className='p-8 grid gap-4 '>
            <div>
              <h2 className='text-3xl mr-48'>Photos de {place.title}</h2>
              <button onClick={() => setShowAllPhotos(false)} className='fixed right-12 top-8 flex p-2 gap-1 items-center rounded-xl bg-primary text-white'>
                <IoMdClose/>
                Retour
              </button>
            </div>
          {
            place?.images?.length > 0 && place.images.map(photo => (
              <div>
                <Image src={photo} alt = "" />
              </div>
            ))
           }
          </div>
        </div>
      )};


  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.adress}</AddressLink>
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
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}<br />
          Check-out: {place.checkOut}<br />
          Max d'invités: {place.maxGuests}
        </div>
        <div>
          <BookingWidg place={place}/>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Plus d'infos</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
      </div>
    </div>

  )
}
