import { useState } from "react";

export default function Contact(){

    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    async function sendMessage(ev) {
        ev.preventDefault();
    
          const response =  await fetch('http://localhost:4000/contact', {
                method: 'POST',
                body: JSON.stringify({username, message, email, phone}),
                headers: {'Content-Type':'application/json'},
            });
            if(response.status === 200){
                alert('Message successful.');
            }
            else{
                alert('Message failed.');
            }
       

    }
    return(
        <form className="register" onSubmit={sendMessage}>
            <h1 className="text-white">Contacto</h1>
            <input type="text" 
            placeholder="Nome" 
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
              <textarea type="text" className="text-area"
             placeholder="Mensagem" rows={6}
             value={message}
             onChange={ev => setMessage(ev.target.value)}
             />
        
            <button>Enviar mensagem</button>
        </form>
    )
}