import { useState } from "react";
import {Navigate} from "react-router-dom";

export default function LoginPage(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function login(ev) {
        ev.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                setRedirect(true);
               
            } else {
                const error = await response.json();
                console.error('Login failed:', error);
            }
                       
        } catch (err) {
            console.error('Error during login:', err);
        }
    }
    
    if(redirect){
        return <Navigate to={'/'}/>
    }
    return(
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input
             type="text"
             placeholder="Username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}
              />
            <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
    )
}