import './App.css';
import Post from "./Post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage.js";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from './UserContext.js';
import CreatePost from './pages/CreatePost.js';
import PostPage from './pages/PostPage.js';
import EditPost from './pages/EditPost.js';
import WhoAreWe from './pages/WhoAreWe.js';
import Contact from './pages/Contact.js';
import Events from './pages/EventsPage.js';
import CreateEvent from './pages/CreateEvent.js';
import EventsPage from './pages/EventsPage.js';
import EventPage from './pages/EventPage.js';
import EditEvent from './pages/EditEvent.js';
import Sponsors from './pages/Sponsors.js';



function App() {
  return (
    
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/create' element={<CreatePost/>}/>
          <Route path='/post/:id' element={<PostPage/>}/>
          <Route path='/edit/:id' element={<EditPost/>}/>
          <Route path='/who' element={<WhoAreWe/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/events' element={<EventsPage/>}/>
          <Route path='/create-event' element={<CreateEvent/>} />
          <Route path='event/:id' element={<EventPage/>}/>
          <Route path='edit-event/:id' element={<EditEvent/>}/>
          <Route path='/sponsors' element={<Sponsors/>}/>
        </Route>
      </Routes>
    </UserContextProvider>

  );
}

export default App;