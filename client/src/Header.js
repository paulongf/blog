import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

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

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/logo-palmeiras.jpg" alt="Logo" />
        </Link>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {username ? (
                <>
                  <li className="nav-item text-green">
                    <Link to="/who">Quem somos</Link>
                  </li>
                  <li className="nav-item">
                    <Link >Parcerias</Link>
                  </li>
                  <li className="nav-item">
                    <Link >Eventos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/contact" >Contacto</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/create" >Create new post</Link>
                  </li>
                  <li className="nav-item">
                    <Link onClick={logout}>Logout</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/who" >Quem somos</Link>
                  </li>
                  <li className="nav-item">
                    <Link >Parcerias</Link>
                  </li>
                  <li className="nav-item">
                    <Link >Eventos</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/contact" >Contacto</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" >Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
