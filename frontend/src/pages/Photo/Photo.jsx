import './Photo.css';

import { uploads } from '../../utils/config';

import Message from "../../components/Message";
import PhotoItem from '../../components/PhotoItem';
import LikeContainer from '../../components/LikeContainer';
import { Link } from "react-router-dom";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getPhoto, like, comment, resetMessage } from '../../slices/photoSlice';

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector((state) => state.photo);

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  const handleLike = () => {
    dispatch(like(photo.id));
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleComment = (e) => {
    e.preventDefault();

    const photoData = {
      comment: commentText,
      id: photo.id,
    };

    dispatch(comment(photoData));
    setCommentText("");
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div id='photo'>
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />

      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>

      <div className="comments">
        {photo.comments && (
          <>
            <h3>Comentários ({photo.comments.length}):</h3>
            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder='Insira o seu comentário...'
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
              />
              <input type="submit" value="Enviar" />
            </form>
            {photo.comments.length === 0 && <p>Não há comentários...</p>}
            {photo.comments.map((comment) => (
              <div className="comment" key={comment.comment}>
                <div className="author">
                  {comment.userImage && (
                    <img src={`${uploads}/user/${comment.userImage}`} alt={comment.userName} />
                  )}
                  <Link to={`/user/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link>
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Photo;
