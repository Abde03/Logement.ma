import { useEffect } from 'react'
import AccountNav from '../components/AccountNav'
import Perks from '../components/perks';
import PhotosUp from '../components/photosUp';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate , useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function PlaceFormPage() {

    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [images,setImages] = useState([]);
    const [description,setDescription] = useState('');
    const [type,setType] = useState('apartment');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const navigate = useNavigate();

    useEffect(() => {
      if(!id) return;
      const fetchPlace = async () => {
        const {data} = await axios.get('/place/'+id);
        if(data.success) {
          const place = data.place;
          setTitle(place.title);
          setAddress(place.address);
          setImages(place.images);
          setDescription(place.description);
          setPerks(place.perks);
          setExtraInfo(place.extraInfo);
          setCheckIn(place.checkIn);
          setCheckOut(place.checkOut);
          setMaxGuests(place.maxGuests);
          setPrice(place.price);
          setType(place.type);
        }else{
          toast.error(data.message);
        }
      };
      fetchPlace();
     } ,[id]);

    const savePlace = async(e) => {
      try{
        e.preventDefault();
        const placeData = {
          title, address, description, perks, extraInfo, checkIn, checkOut, maxGuests, price, images, type 
        };
        if(!title || !address || !description || !perks || !extraInfo || !checkIn || !checkOut || !maxGuests || !price || !images || !type) {
          toast.error('Please fill all the fields');
          return;
        }
        if(checkIn > checkOut) {
          toast.error('Check in date should be before check out date');
          return;
        }
        if(id) {
          const {data} =  await axios.put('/place/update/'+id , {...placeData} );
          data.success ? toast.success(data.message) && navigate('/profile/places') : toast.error(data.message);
        }else{
          const {data} = await axios.post('/place/new', placeData);
          data.success ? toast.success(data.message) && navigate('/profile/places') : toast.error(data.message);}
      } catch (error) {
        toast.error(error.message);
      }
    }
  return (
    <div>
        <AccountNav />
        <form onSubmit={savePlace}>
            <h2 className='text-xl mt-4'>Title of your place</h2>
            <input type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder='e.g. Apartment with good view' />
            <h2 className='text-xl mt-4'>Address</h2>
            <input type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='e.g. N°20 Hay Ryad Rabat' />
            <h2 className='text-xl'>Photos</h2>
              <PhotosUp addedPhotos={images} onChange={setImages} />
            <h2 className='text-xl mt-4'>Description</h2>
            <textarea value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description of your place'
            />
            <h2 className='text-2xl mt-4'>Type of accommodation</h2>
            <p className='text-gray-500 text-sm'>Select the type of your accommodation</p>
            <select name="type" id="type" className='mt-2 border border-gray-600 p-2 rounded-md' value={type} onChange={(e) => setType(e.target.value)}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="room">Room</option>
              <option value="studio">Studio</option>
              <option value="other">Other</option>
            </select>
            <h2 className='text-2xl mt-4'>Equipment</h2>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 mt-2'>
              <Perks selected={perks} onChange={setPerks} />
            </div>
            <h2 className='text-xl mt-4'>Additional information</h2>
            <textarea value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)} />
            <h2 className='text-xl mt-4'>Availability</h2>
            <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
              <div>
                <h3 className='mt-2 -mb-1'>From :</h3>
                <input type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)} />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>To :</h3>
                <input type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)} />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Max number of guests</h3>
                <input type="text"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)} />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Price for one night</h3>
                <input type="text"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
            <button className='w-full bg-primary text-white py-3 px-6 rounded-full mt-4'>Save</button>
          </form>
        </div>
  )
}
