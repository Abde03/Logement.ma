import {useState , useEffect}  from 'react'
import {useParams, Link} from 'react-router-dom'
import { TbCircleArrowLeft } from 'react-icons/tb'
import axios from 'axios'
import AddressLink from '../components/AddressLink'
import BookingDates from '../components/BookingDates'
import PlaceGallery from '../components/PlaceGallery'
import AccountNav from '../components/AccountNav'
import {toast} from 'react-toastify'


export default function BookingPage() {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);
    const [status,setStatus] = useState('');
    useEffect(() => {
      const fetchBooking = async () => {
        try {
          if(!id) return;
          const {data} = await axios.get('/booking/'+id);
          const {booking} = data;
          if (data.success) {
            setBooking(booking);
            setStatus(booking.status);
          }else{
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
      fetchBooking();
    }, [id]);
  
    if (!booking) {
      return '';
    }
  
    return (
      <div className="flex flex-col gap-3">
        <AccountNav />
        <Link to={'/profile/bookings'} className="flex gap-1 bg-primary text-white rounded-full py-2 px-4 max-w-max">
          <TbCircleArrowLeft className="w-6 h-6" />
          Back
        </Link>
        <h1 className="text-3xl">{booking.place.title}</h1>
        <AddressLink className="my-2 block">{booking.place.adress}</AddressLink>
        <div className="flex gap-2 items-center justify-between">
          <div className="text-gray-500 text-sm">
            <span className="font-bold">{booking.name}</span> has reserved
          </div>
          <div className="text-gray-500 text-sm">
            Statut: <span className={`font-bold ${status==='confirmed'? 'text-green-500' : 'text-sky-500'}`}>{status}</span>
          </div>
        </div>
        <div className="bg-gray-200 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className='flex flex-col gap-2'>
            <h2 className="text-2xl mb-4">Reservation information:</h2>
            <BookingDates checkIn={booking.checkIn} checkOut={booking.checkOut} />
          </div>
          <div className="bg-primary p-4 text-white rounded-2xl">
            <div>Total Price:</div>
            <div className="text-3xl">{booking.price}DH</div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    );
}
