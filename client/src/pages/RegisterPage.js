import { useState } from "react";

export default function RegisterPage(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    async function register(ev) {
        ev.preventDefault();
    
          const response =  await fetch('http://localhost:4000/register', {
                method: 'POST',
                body: JSON.stringify({username, password, email, phone}),
                headers: {'Content-Type':'application/json'},
            });
            if(response.status === 200){
                alert('Registration successful.');
            }
            else{
                alert('Registration failed.');
            }
       

    }
    return(
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
            placeholder="Username" 
            value={username}
            onChange={ev => setUsername(ev.target.value)}
            />
             <input type="email"
             placeholder="Email"
             value={email}
             onChange={ev => setEmail(ev.target.value)}
             />
              <input type="phone"
             placeholder="Phone"
             value={phone}
             onChange={ev => setPhone(ev.target.value)}
             />
            <input type="password"
             placeholder="Password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}
             />
            <button>Register</button>
        </form>
    )
}