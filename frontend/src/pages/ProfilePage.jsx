import {useContext, useState, useRef} from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify';
import axios from 'axios';
import PlacePage from './PlacesPage';
import AccountNav from '../components/AccountNav';
import { UserContext } from '../context/user-context';


export default function ProfilePage() {

    const {user, setUser, setIsLoggedIn, getUser} = useContext(UserContext)
    const navigate = useNavigate();
    let {subpage} = useParams();
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef([]);

    const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
        inputRef.current[index + 1].focus();
      }
    }
    const handlekeyDown = (e, index) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text');
      const pasteArray = paste.split('');
      pasteArray.forEach((item, index) => {
        if (inputRef.current[index]) {
          inputRef.current[index].value = item;
          inputRef.current[index].focus();
        }
      });
    }
    const onSubmit = async(e) => {
      try {
        e.preventDefault();
        const otpArray = inputRef.current.map(e => e.value);
        const otp = otpArray.join('');

        const {data} = await axios.post('/auth/verify-otp', {otp});
        if (data.success) {
          toast.success(data.message);
          getUser();
          setShowInput(false);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }catch (error) {
        toast.error(error.message);
      }
    }

    if (subpage === undefined) {
      subpage = 'profile';
    }

    const handleSignOut = async () => {
        try {
          const {data} = await axios.get('/auth/signout');
          if(data.success){
            setIsLoggedIn(false);
            setUser(null);
            toast.success(data.message);
          }
          else {
            toast.error(data.message);
          }
          navigate('/');
        }catch (error){
          toast(error.message);
        }
      };
      
      const isVerified = user?.isAccountVerified;
    
      const handleSentCode = async () => {
        try {
          setLoading(true);
          const {data} = await axios.post('/auth/send-verify-otp');
          if(data.success){
            setShowInput(true);
            toast.success(data.message);
          }else {
            toast.error(data.message);
          }
        }catch (error){
          toast(error.message);
        }
        finally {
          setLoading(false);
        }
      }


    
  return (
    <div className='h-full grow flex flex-col gap-4'>
      <AccountNav />
      {subpage === 'profile' && (
          <div className='flex flex-col max-w-lg mx-auto items-center gap-4 p-4  '> 
            <span className='text-3xl font-semibold text-center'>
              {user ? `Glad to see you again ${user.name}` : 'Log in to see your profile'}
            </span>
            <button onClick={handleSignOut} className='primary max-w-sm rounded-full'>Log out</button>
            {!isVerified && (
              <div className='flex flex-col max-w-lg mx-auto items-center gap-4 p-4 '>
                <span className='text-xl font-semibold text-center'>
                  Verify your account to enjoy all the features
                </span>
                {!showInput ? (
                  <button
                    onClick={handleSentCode}
                    className='primary max-w-sm rounded-full'
                    disabled={loading}
                  >
                    {loading ? 'Sending email...' : 'Verify my account'}
                  </button>
                ) : (
                  <>
                  <p className='text-start text-sm text-gray-500'>
                    We have sent a verification code to your email address. Please enter the code below to verify your account.
                  </p>
                  <div className='flex justify-between gap-2' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                      <input type='number' maxLength={1} required
                        className='w-12 h-12 text-center text-xl rounded-md border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                        key={index} ref={e => inputRef.current[index] = e}
                        onInput={(e) => handleInput(e,index)}
                        onKeyDown={(e) => handlekeyDown(e,index)}
                        
                      />
                    ))}
                  </div>  
                  <button
                    onClick={onSubmit}
                      className='primary max-w-sm rounded-full'
                      disabled={loading}
                  >
                    {loading ? 'Verification...' : 'Verify'}
                  </button>
                  </>
                )}
              </div>
            )}
          </div>
      )}
      {subpage === 'places' && (
        <PlacePage />
      )}
    </div>
  )
}
