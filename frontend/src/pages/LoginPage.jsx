import {Link, useNavigate} from "react-router-dom";
import {useState, useContext} from 'react';
import axios from "axios";
import { UserContext } from "../context/user-context.jsx";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn, getUser } = useContext(UserContext);
  const navigator = useNavigate();
  
  async function handleSubmit(ev) {
    try {
      ev.preventDefault();
      const {data} = await axios.post('/auth/login', {email, password});
      console.log(data);
      if(data.success){
        setIsLoggedIn(true);
        getUser();
        navigator('/');
        toast.success(data.message);        
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  
  return (
    <div className="h-full grow flex items-center justify-center ">
      <div>
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit} >
          <input type="email"
                 placeholder="Enter your email"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="Enter your password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary hover:opacity-95">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Don&apos;t have an account? <Link className="underline text-black" to={'/register'}>Register</Link> <br />
            <Link className="underline text-black" to={'/forgot-password'}>Forgot your password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}