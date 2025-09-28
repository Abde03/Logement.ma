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
      toast.error(error.response?.data?.message || error.message);
    }
  }
  
  
  return (
    <div className="h-full grow flex items-center justify-center ">
      <div>
        <h1 className="text-4xl text-center mb-4">Login</h1>
        
        {/* Demo Login Notice */}
        <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">🏠 Demo Owner Account</h3>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">Test the accommodation owner features:</p>
          <div className="bg-white dark:bg-gray-800 p-2 rounded border text-xs font-mono">
            <div className="text-gray-600 dark:text-gray-300">Email: <span className="text-blue-600 dark:text-blue-400 font-semibold">Owner@logement.ma</span></div>
            <div className="text-gray-600 dark:text-gray-300">Password: <span className="text-blue-600 dark:text-blue-400 font-semibold">Owner123</span></div>
          </div>
        </div>

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
          <div className="text-center py-2 text-gray-500 dark:text-gray-400">
            Don&apos;t have an account? <Link className="underline text-black dark:text-white hover:text-red-500" to={'/register'}>Register</Link> <br />
            <Link className="underline text-black dark:text-white hover:text-red-500" to={'/forgot-password'}>Forgot your password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}