import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../Editor';

export default function EditEvent() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');  // Alterei de content para description
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/event/${id}`)
      .then((response) =>
        response.json().then((eventInfo) => {
          setTitle(eventInfo.title);
          setSummary(eventInfo.summary);
          setDescription(eventInfo.description);  // Atualizei para description
          setDate(eventInfo.date);
          setLocation(eventInfo.location);
        })
      );
  }, [id]);

  async function updateEvent(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('description', description);  // Atualizei para description
    data.set('date', date);
    data.set('location', location);
    data.set('id', id);

    if (files?.[0]) {
      data.set('file', files?.[0]);
    }

    const response = await fetch(`http://localhost:4000/event/${id}`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/event/${id}`} />;
  }

  return (
    <div className='container register'>
    <form className='create-post' onSubmit={updateEvent}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(ev) => setDate(ev.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(ev) => setLocation(ev.target.value)}
      />

      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
      />

      <Editor value={description} onChange={setDescription} />  {/* Atualizei para description */}

      <button style={{ marginTop: '5px' }}>Update Event</button>
    </form>
    </div>
  );
}
