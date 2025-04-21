import Post from "../Post";
import {useEffect, useState} from "react";


export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    fetch('https://palmeiras-porto-frontend.onrender.com/post').then(response =>{
      response.json().then(posts =>{
        setPosts(posts);
      })
    });
  }, [])
 
  return (

    <div className="posts-container container "> 
    {posts.length > 0 && posts.map(post => (
      <Post key={post._id} {...post} />
    ))}
  </div>
  );
}