import { Link } from "react-router-dom";
import { format } from 'date-fns';

export default function Event({_id, title, summary, cover, date, organizer}) {

  return (
    <div className="post">
      <div className="image">
        <Link to={`/event/${_id}`} >
          <img src={'http://localhost:4000/' + cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/event/${_id}`} >
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{organizer?.username}</a>
          <time>{format(new Date(date), 'MMM d, yyyy HH:mm')}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
