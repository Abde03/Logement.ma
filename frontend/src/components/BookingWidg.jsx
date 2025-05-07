import {useState} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

BookingWidg.propTypes = {
  place: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    maxGuests: PropTypes.number.isRequired,
    checkIn: PropTypes.string.isRequired,
    checkOut: PropTypes.string.isRequired,
  }).isRequired,
};
export default function BookingWidg({place}) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const numberOfNights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;
    

    const bookingPlace = async (e) => {
      try {
        e.preventDefault();
        const userCheckIn = new Date(checkIn);
        const userCheckOut = new Date(checkOut);
        const placeCheckIn = new Date(place.checkIn);
        const placeCheckOut = new Date(place.checkOut);

        if (userCheckIn < placeCheckIn || userCheckOut > placeCheckOut) {
          toast.error('Les dates de réservation ne sont pas disponibles');
          return;
        }
        if (numberOfGuests > place.maxGuests) {
          toast.error('Le nombre d\'invités dépasse la capacité maximale de l\'endroit');
          return;
        }

        const {data} = await axios.post('/booking/new', {
          placeId: place._id,
          checkIn,
          checkOut,
          numberOfGuests,
          name,
          phone,
          price: numberOfNights * place.price,
        });
        if (data.success) {
          toast.success(data.message);
          navigate('/profile/bookings');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
   
    }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        <span className="font-bold">{place.price}</span> DH / night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}
              min={place.checkIn}
              max={place.checkOut}
              disabled={!place.checkIn}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" 
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}
              min={place.checkIn}
              max={place.checkOut}
              disabled={!checkIn}
              className={!checkIn ? 'opacity-50' : ''}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number"
            value={numberOfGuests}
            onChange={ev => setNumberOfGuests(ev.target.value)}
            max={place.maxGuests}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Full Name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
            <label>Telephone number:</label>
            <input type="tel"
                   value={phone}
                   maxLength={10}
                   onChange={ev => setPhone(ev.target.value)}/>
          </div>
        )}
      </div>
      <button onClick={bookingPlace} className="primary mt-4">
        To book
        {numberOfNights > 0 && (
          <span> {numberOfNights * place.price} DH</span>
        )}
      </button>
    </div>
  )
}
