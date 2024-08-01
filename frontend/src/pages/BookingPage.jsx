import React , {useState , useEffect}  from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import AddressLink from '../components/AddressLink'
import BookingDates from '../components/BookingDates'
import PlaceGallery from '../components/PlaceGallery'
import { useSelector } from 'react-redux'

export default function BookingPage() {
    const {id} = useParams();
    const [booking,setBooking] = useState(null);
    const {CurrentUser} = useSelector(state => state.user);
    useEffect(() => {
      if (id) {
        axios.get('/booking/all' , { params: { userID: CurrentUser._id } }).then(response => {
          const foundBooking = response.data.find(({_id}) => _id === id);
          if (foundBooking) {
            setBooking(foundBooking);
          }
        });
      }
    }, [id]);
  
    if (!booking) {
      return '';
    }
  
    return (
      <div className="my-8">
        <h1 className="text-3xl">{booking.place.title}</h1>
        <AddressLink className="my-2 block">{booking.place.adress}</AddressLink>
        <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-4">Reservation informations:</h2>
            <BookingDates booking={booking} />
          </div>
          <div className="bg-primary p-6 text-white rounded-2xl">
            <div>Prix Totale :</div>
            <div className="text-3xl">{booking.price}DH</div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    );
}
