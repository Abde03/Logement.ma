import React, { useEffect } from 'react'
import AccountNav from '../components/AccountNav'
import Perks from '../components/perks';
import PhotosUp from '../components/photosUp';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate , useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';


export default function PlaceFormPage() {

    const {id} = useParams();
    const {CurrentUser} = useSelector(state => state.user);
    const [title,setTitle] = useState('');
    const [adress,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const navigate = useNavigate();

    useEffect(() => {
      if(!id) return;
      axios.get('/place/'+id).then(response => {
        const place = response.data;
        console.log(place);
        setTitle(place.title);
        setAddress(place.adress);
        setAddedPhotos(place.images);
        setDescription(place.description);
        setPerks(place.perks);
        setExtraInfo(place.extraInfo);
        setCheckIn(place.checkIn);
        setCheckOut(place.checkOut);
        setMaxGuests(place.maxGuests);
        setPrice(place.price);
      });
    }, [id]);

    async function savePlace(e) {
        e.preventDefault();
        const placeData = {
          title, adress, description, perks, extraInfo, checkIn, checkOut, maxGuests, price, addedPhotos , CurrentUser
        };
        if(id) {
          await axios.put('/place/update' , { CurrentUser ,id, ...placeData } );
          navigate('/profile/places')
          return;
        }else{
        await axios.post('/place/new', placeData);
        navigate('/profile/places')
        }
      }
  return (
    <div>
        <AccountNav />
        <form onSubmit={savePlace}>
            <h2 className='text-xl mt-4'>Titre</h2>
            <input type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder='exp "Maison du luxe"' />
            <h2 className='text-xl mt-4'>Adresse</h2>
            <input type="text" 
              value={adress} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Rue BenJelone N°20 Rabat' />
            <h2 className='text-xl'>Photos</h2>
              <PhotosUp addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            <h2 className='text-xl mt-4'>Description</h2>
            <textarea value={description} 
              onChange={(e) => setDescription(e.target.value)} />
            <h2 className='text-2xl mt-4'>Equipements</h2>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 mt-2'>
              <Perks selected={perks} onChange={setPerks} />
            </div>
            <h2 className='text-xl mt-4'>informaitons supplémentaires</h2>
            <textarea value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)} />
            <h2 className='text-xl mt-4'>Check in/out</h2>
            <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
              <div>
                <h3 className='mt-2 -mb-1'>Arrivée</h3>
                <input type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)} />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Depart</h3>
                <input type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)} />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Max d'invités</h3>
                <input type="text"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)} />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Prix pour une nuit</h3>
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
