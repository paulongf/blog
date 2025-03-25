import { useEffect, useState } from "react";
import Event from "../Event";  

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/event')  
      .then(response => response.json())
      .then(events => {
        setEvents(events);
      });
  }, []);

  return (
    <div className="posts-container container ">
      {events.length > 0 ? (
        events.map(event => (
          <Event key={event._id} {...event} /> 
        ))
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
}
