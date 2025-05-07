import {useState,useRef} from 'react'
import {CiMail, CiLock} from 'react-icons/ci'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function ResetPassword() {

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState('')
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otp, setOtp] = useState(0)

  const sendOtp = async (ev) => {
    try {
      ev.preventDefault()
      setLoading(true)
      const {data} = await axios.post('/auth/send-reset-password-otp', {email})
      if(data.success){
        toast.success(data.message)
        setIsEmailSent(true)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally{
      setLoading(false)
    }
  }
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
        e.preventDefault();
        const otpArray = inputRef.current.map(e => e.value);
        setIsOtpVerified(true);
        setOtp(otpArray.join(''));
    }

    const handleChangePassword = async (e) => {
      try {
        e.preventDefault();
        setLoading(true)
        const {data} = await axios.post('/auth/reset-password', {email, newPassword, otp})
        if(data.success){
          toast.success(data.message)
          navigate('/login')
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      } finally{
        setLoading(false)
      }
    }



  return (
    <div className="flex grow items-center justify-center ">
      <div className='flex flex-col gap-2 mx-auto'>
        <h1 className="text-4xl text-center">Reset Password</h1>

        {!isEmailSent && (
          <form className="flex flex-col gap-2" onSubmit={sendOtp} >
          <p className='flex justify-center items-center gap-1 text-gray-600 '> <CiMail/> Enter your email address</p>
          <input type="email"
                 placeholder="e.g. you@example.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <button className="primary hover:opacity-95" type='submit' disabled={loading}> 
            {loading ? 'Sending...' : 'Send code'}
          </button>
        </form>

        )}
        
        {isEmailSent && !isOtpVerified && (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 text-center items-center">
            <p className='inline-flex items-center text-gray-600'>
              <CiLock /> A verification code has been sent to your email address in the form of 6 digits.
            </p>
            <div className='flex gap-4 max-w-screen-sm' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type='text' maxLength={1} required 
                  className='w-12 h-12 text-center text-xl rounded-md border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                  key={index} ref={e => inputRef.current[index] = e}
                  onInput={(e) => handleInput(e,index)}
                  onKeyDown={(e) => handlekeyDown(e,index)}
                />
              ))}
            </div>  
            <button
              type='submit'
              className='primary max-w-sm rounded-full'
              disabled={loading}
            >
              {loading ? 'Verification...' : 'Verify'}
            </button>
        </form>
        )}
        
        {isOtpVerified && isEmailSent && (
          <form onSubmit={handleChangePassword}>
            <p className='flex justify-center items-center gap-1 text-gray-600 '> <CiLock/> Enter your new password</p>
            <input type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={ev => setNewPassword(ev.target.value)} />
            <button className="primary hover:opacity-95" type='submit' disabled={loading}> 
              {loading ? 'Sending...' : 'Send code'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
