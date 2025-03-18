import { useContext, useState } from "react";
import {Navigate} from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

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
                response.json().then(userInfo =>{
                    setUserInfo(userInfo);
                    setRedirect(true);
                })
                const data = await response.json();
                console.log('Login successful:', data);
               
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