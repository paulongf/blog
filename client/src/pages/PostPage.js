import { useContext, useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();
    const [redirect, setRedirect] = useState(false);
    const [showModal, setShowModal] = useState(false); // Estado para controle do modal

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => response.json())
            .then(postInfo => setPostInfo(postInfo));
    }, []);

    async function deletePost() {
        const response = await fetch(`http://localhost:4000/post/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            setRedirect(true);
        } else {
            console.error("Erro ao deletar post");
        }
    }

    if (redirect) {
        return <Navigate to={`/`} />;
    }

    if (!postInfo) return "";

    return (
        <div className="post-page container">
            <h1>{postInfo.title}</h1>
            <time>
                {postInfo.createdAt
                    ? format(new Date(postInfo.createdAt), "dd/MM/yyyy HH:mm")
                    : "Data indisponível"}
            </time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit this post
                    </Link>
                    <Link className="delete-post-btn" onClick={() => setShowModal(true)}>
                        X Delete post
                    </Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="Post cover" />
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />

            {/* Modal de Confirmação */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Exclusão</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Tem certeza de que deseja excluir este post?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => { deletePost(); setShowModal(false); }}>
                                    Deletar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
