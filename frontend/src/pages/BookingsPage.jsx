import { useState , useEffect } from 'react'
import AccountNav from '../components/AccountNav'
import axios from 'axios';
import { Link } from 'react-router-dom';
import PlaceImg from '../components/PlaceImg';
import BookingDates from '../components/BookingDates';
import { toast } from 'react-toastify';
import { TbPhone, TbCheck  } from 'react-icons/tb';
import { GoX } from "react-icons/go";



export default function BookingsPage() {

    const [bookings,setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('owner');
    useEffect(() => {
        const fetchBookings = async () => {
            setBookings([]);
            try {
                const endpoint = activeTab === 'owner' ? '/booking/owner' : '/booking/user';
                const {data} = await axios.post(endpoint);
                const {bookings} = data;
                if(data.success) {
                    setBookings(bookings);
                    toast.success(data.message);
                }else{
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        fetchBookings();
    }
    , [activeTab]);

    const handleStatus = async (id, status) => {
        try {
            const {data} = await axios.patch('/booking/'+id+'/status', {status});
            if(data.success) {
                setBookings(prevBookings => prevBookings.map(booking => booking._id === id ? {...booking, status} : booking));
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    

  return (  
    <div className='flex flex-col grow'>
        <AccountNav />
        <div className='w-full flex mt-8 justify-center text-center gap-4'>
            <button 
                className={`px-4 py-2 rounded-xl ${
                    activeTab === 'owner' ? 'bg-primary text-white' : 'bg-gray-200 text-black'
                }`}
                onClick={() =>setActiveTab('owner')}
            >
                Owner
            </button>
            <button 
                className={`px-4 py-2 rounded-xl ${
                    activeTab === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-black'
                }`}
                onClick={() => setActiveTab('user')}
            >
                Visitor
            </button>
        </div>
        <div className="">
            {
                bookings.length === 0 ? (
                    <div className='flex justify-center mt-10'>
                        <h2 className="text-xl">No {activeTab === 'owner' ? 'booking requests' : 'bookings'} found.</h2>
                    </div>
                ) : (
                    bookings.map(({_id,price,place,index,checkIn,checkOut,status,name,phone}) => (
                    <Link key={index} to={`/profile/bookings/${_id}`} className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 bg-gray-200 rounded-2xl overflow-hidden">
                        <div className="w-auto flex-1 justify-center items-center">
                            <PlaceImg place={place} />
                        </div>
                        <div className="flex flex-2 flex-col gap-1 p-4">
                            <h2 className="text-xl">{place.title}</h2>
                            {
                                activeTab === 'owner' ? (
                                    <div className="text-sm text-gray-500 flex flex-col gap-1">
                                        <p><span className="font-bold text-lg">{name}</span> has reserved</p>
                                        <p className='text-lg inline-flex items-center space-x-1'> <TbPhone/> <span>{phone}</span></p>
                                    </div>
                                ) : (
                                    ''
                                )

                            }
                            <p>Status : <span className={`font-bold ${status==='confirmed'? 'text-green-500' : 'text-sky-500'}`}>{status}</span> </p>
                            <BookingDates checkIn={checkIn} checkOut={checkOut} className="mb-2 mt-4 text-gray-500" />
                            <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    <span className="text-2xl">
                                        Total Price : {price} DH
                                     </span>
                            </div>
                            {
                                activeTab === 'owner' && status === 'pending' ? (
                                    
                                    <div className='flex justify-between items-center mt-4'>
                                        <button 
                                            className='p-2 rounded bg-green-500 text-white flex items-center gap-1'
                                            onClick={() => handleStatus(_id,'confirmed')}
                                        > 
                                            <TbCheck /> Confirm 
                                        </button>
                                        <button 
                                            className='p-2 rounded bg-red-500 text-white flex items-center gap-1'
                                            onClick={() => handleStatus(_id,'rejected')}
                                        > 
                                            <GoX /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                        </div>
                    </Link>
                    )
                ))
            }
        </div>
    </div>
  )
}
