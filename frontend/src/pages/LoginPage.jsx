import {Link, Navigate} from "react-router-dom";
import {useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from 'react-redux';
import { signInSucces , signInFailure , signInStart }  from '../redux/user/userSlice.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  
  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post('/auth/login', {email, password});
      const {data} = response;
      console.log(data);
      if(!response){
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSucces(data)); 
      alert('Logged in successfully');
      navigator('/');
      
    } catch (error) {
      dispatch(signInFailure(error));
    }
  }
  
  
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit} >
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button
            disabled={loading} 
            className="primary hover:opacity-95">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
          </div>
        </form>
        <p className='text-red-700 mt-5'>
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
      </div>
    </div>
  );
}