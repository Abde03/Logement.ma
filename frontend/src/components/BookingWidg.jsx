import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';


export default function BookingWidg(place) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const {CurrentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const numberOfNights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;

    async function bookingPlace() {
      const response = await axios.post('/booking/new', {
        place: place._id,
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        price: numberOfNights * place.price,
        user: CurrentUser._id
      })
      const bookingId = response.data._id;
      navigate(`/profile/bookings/${bookingId}`);
    }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Prix:  {place.price} DH/ pour nuit
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
                   value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Nombre d'invités:</label>
          <input type="number"
                 value={numberOfGuests}
                 onChange={ev => setNumberOfGuests(ev.target.value)}/>
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Nom Complet:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>N° Telephone:</label>
            <input type="tel"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      <button onClick={bookingPlace} className="primary mt-4">
        Reserver
        {numberOfNights > 0 && (
          <span> {numberOfNights * place.price} DH</span>
        )}
      </button>
    </div>
  )
}
