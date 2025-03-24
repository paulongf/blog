import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function Header(){
    const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((userInfo) => {
                        setUserInfo(userInfo);
                    });
                } else {
                    console.error('Erro ao buscar perfil', response);
                }
            })
            .catch((error) => console.error('Erro de rede', error));
    }, []);
    
    function logout(){
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return(
        <header>
        <div className="header-container">
            <Link to="/" className="logo">
                <img src="/logo-palmeiras.jpg" alt="Logo" />
            </Link>
            <nav>
                {username ? (
                    <>
                        <Link to="/who">Quem somos</Link>
                        <Link>Parcerias</Link>
                        <Link>Eventos</Link>
                        <Link to="/contact">Contacto</Link>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/who">Quem somos</Link>
                        <Link>Parcerias</Link>
                        <Link>Eventos</Link>
                        <Link to="/contact">Contacto</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </div>
    </header>
    
    )
}