import { useState , useEffect } from 'react'
import { FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom'
import Image from '../components/image'
import AccountNav from '../components/AccountNav'
import AddressLink from '../components/AddressLink';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaKeyboard, FaTrash } from 'react-icons/fa';

export default function PlacesPage() {

  const [places,setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const {data} = await axios.post('/place/user');
        if (data.success) {
          setPlaces(data.data?.places || data.places || [])
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    };
    fetchPlaces();
  },[]);

// method to delete a place
  const handleDelete = async (placeId) => { 
    try {
      const message = window.confirm('Are you sure you want to delete this place?');
      if (!message) {
        return;
      }
      const {data} = await axios.delete('/place/delete/'+placeId);
      if (data.success) {
        setPlaces(places.filter(place => place._id !== placeId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    try {
      const {data} = await axios.delete('/place/delete/'+placeId);
      if (data.success) {
        setPlaces(places.filter(place => place._id !== placeId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
}
 
  return (
    <div className='flex flex-col grow'>
      <AccountNav />
        <div className='p-8 text-center'>
            <Link to='/profile/places/new' className='inline-flex gap-1 items-center bg-primary text-white py-3 px-6 rounded-full'>
              <FaPlus/>
              Add a new place
            </Link>
        </div>
        <div className='flex flex-col gap-4 p-4'>
          {places.length > 0 && places.map((place, index) => (
            <div key={index} to={'/profile/places/'+place._id} className='flex flex-col md:flex-row justify-between cursor-pointer md:items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl gap-5'>
              <div className='flex w-auto h-32 items-center bg-gray-300 shrink-0 rounded-2xl overflow-hidden md:w-48'>
                {place.images.length > 0 && (
                  <Image className = "object-cover" src={place.images[0]} alt={place.title} />
                )}
              </div>
              <div className='flex-1 flex-col grow shrink gap-2'>
                <h2 className='text-xl'>{place.title}</h2>
                <AddressLink className='text-sm'>{place.address}</AddressLink>
                <p className='text-xl'>{place.price} DH per night</p>
              </div>
              <div className='flex flex-col gap-2 text-center '>
                <Link to={'/place/'+place._id} className='bg-blue-400 text-white py-2 px-4 rounded-full inline-flex gap-2 items-center justify-center'>
                  <FaEye className=''/>
                  <span className="">View</span>
                </Link>
                <Link to={'/profile/places/'+place._id} className='bg-green-400 text-white py-2 px-4 rounded-full inline-flex gap-2 items-center justify-center'>
                  <FaKeyboard className=''/>
                  <span className="">Modify</span>
                </Link>
                <button onClick={() => handleDelete(place._id)} className='bg-primary text-white py-2 px-4 rounded-full inline-flex gap-2 items-center justify-center'>
                  <FaTrash className=''/>
                  <span className="">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}
