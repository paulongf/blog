
import {Link} from "react-router-dom";
import {format} from 'date-fns';

export default function Post({title, summary, content, cover, createdAt, author}) {

  return (
    <div className="post">
      <div className="image">
        <Link >
          <img src={'http://localhost:4000/'+cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author?.username}</a>
          <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}