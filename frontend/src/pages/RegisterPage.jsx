import {React , useState} from 'react'
import {Link, Navigate} from "react-router-dom";
import axios from "axios"

export default function RegisterPage() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(ev) {
        ev.preventDefault();
        try { 
            await axios.post('/auth/register' , {name, email, password});
            alert('User created successfully');
    }catch(err) {
        alert('An error occurred');
        console.error(err);
    }
    }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit} >
            <input type="text"
                     placeholder="Nom complet"
                    value={name}
                    onChange={ev => setName(ev.target.value)} 
                />
            <input type="email"
                 placeholder="Exemple@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} 
            />
            <input type="password"
                 placeholder="Mot de passe"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)}
             />
          <button className="primary">S'inscrire</button>
          <div className="text-center py-2 text-gray-500">
          Vous avez deja un compte? <Link className="underline text-black" to={'/login'}>S'identifier</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
