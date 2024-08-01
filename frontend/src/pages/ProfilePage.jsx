import React from 'react'
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { signOut } from '../redux/user/userSlice';
import { useDispatch , useSelector } from 'react-redux';
import PlacePage from './PlacesPage';
import AccountNav from '../components/AccountNav';


export default function ProfilePage() {

    const {CurrentUser} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let {subpage} = useParams();
    if (subpage === undefined) {
      subpage = 'profile';
    }
    const handleSignOut = async () => {
        try {
          await axios('/auth/signout');
          dispatch(signOut())
          navigate('/')

        } catch (error) {
          console.log(error);
        }
      };

    
  return (
    <div>
        <AccountNav />
        {subpage === 'profile' && (
            <div className='flex flex-col max-w-lg mx-auto items-center gap-4 p-4 '> 
                <span className='text-3xl font-semibold text-center'>Content de te revoir {CurrentUser.name}</span>
                <button onClick={handleSignOut} className='primary max-w-sm rounded-full'>Se Déconnecter</button>
            </div>
        ) }
        {subpage === 'places' && (
          <PlacePage />
        )}

    </div>
  )
}
