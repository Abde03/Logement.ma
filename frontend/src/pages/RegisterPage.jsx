import  {useState, useContext} from 'react'
import {Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"
import { UserContext } from "../context/user-context.jsx";

export default function RegisterPage() { 

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setIsLoggedIn, getUser } = useContext(UserContext);
    const navigator = useNavigate()

    async function handleSubmit(ev) {
      try{ 
        ev.preventDefault();
        const {data} = await axios.post('/auth/register', {
          name : name,
          email : email,
          password : password,
        });

        if(data.success){
          setIsLoggedIn(true);
          getUser();
          navigator('/');
          toast.success(data.message);
        }
      }catch(error) {
        toast.error(error.message);
        }
    }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit} >
            <input type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={ev => setName(ev.target.value)} 
                />
            <input type="email"
                 placeholder="Enter your email"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} 
            />
            <input type="password"
                 placeholder="Enter your password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)}
             />
          <button className="primary" type='submit'>Register</button>
          <div className="text-center py-2 text-gray-500">
            Already have an account? <Link className="underline text-black" to={'/login'}>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
