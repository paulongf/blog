
import {Link} from "react-router-dom";

export default function Post() {

  return (
    <div className="post">
      <div className="image">
        <Link >
          <img src="/palmeiras.jpg" alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link>
        <h2>Palmeiras</h2>
        </Link>
        <p className="info">
          <a className="author">Paulo Gama</a>
          <time>25/03/2025</time>
        </p>
        <p className="summary">Breve sinopse</p>
      </div>
    </div>
  );
}