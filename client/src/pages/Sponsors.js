import { Link } from "react-router-dom";

export default function Sponsors(){
    return(
        <div className="container sponsor-container">
            <Link target="_blank" to="https://www.instagram.com/icaroautocenter/">
            <h3>ÍCARO AUTO CENTER</h3>
            <h5>Rua da Fontinha, 77, Porto, Portugal 5000629</h5>
            </Link>
            <Link target="_blank"  to="https://www.instagram.com/keliorichowski.sweet/">
            <h3>KELI ORICHOWSKI</h3>
            <h5>WhatsApp: +351919550155</h5>
            </Link>
            <Link target="_blank"  to="https://www.instagram.com/marin.performance/">
            <h3>MARIN PERFORMANCE</h3>
            <h5>Saúde e Performance - Atletas e "não" Atletas</h5>
            </Link>
        </div>
    )
}