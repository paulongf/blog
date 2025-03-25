import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../Editor';

export default function CreateEvent() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewEvent(ev) {
        ev.preventDefault();
        
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('description', content);
        data.set('date', date);
        data.set('location', location);
        if (files[0]) {
            data.set('file', files[0]);
        }

        const response = await fetch('http://localhost:4000/event', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container register">
            <form className="create-post" onSubmit={createNewEvent}>
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

                <input type="file" onChange={(ev) => setFiles(ev.target.files)} />

                <Editor value={content} onChange={setContent} />

                <button style={{ marginTop: '5px' }}>Create Event</button>
            </form>
        </div>
    );
}
