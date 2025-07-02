import "./Profile.css";

import { uploads } from "../../utils/config";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails, resetMessage } from "../../slices/userSlice";
import {
  publishPhoto,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  const handleFile = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const submitHandle = (e) => {
    e.preventDefault();

    const photoData = { title, image };
    const formData = new FormData();
    Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    dispatch(publishPhoto(formData));
    setTitle("");
    setImage("");

    resetComponentMessage();
  };

  const handleDelete = (photoId) => {
    dispatch(deletePhoto(photoId)).then(() => {
      dispatch(getUserPhotos(id));
    });
    resetComponentMessage();
  };

  const handleEdit = (photo) => {
    setEditId(photo.id);
    setEditTitle(photo.title);
    editPhotoForm.current.classList.remove("hide");
    newPhotoForm.current.classList.add("hide");

    resetComponentMessage()
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = { id: editId, title: editTitle };
    dispatch(updatePhoto(photoData)).then(() => {
      cancelEdit();
      dispatch(getUserPhotos(id));
    });

    resetComponentMessage();
  };

  const cancelEdit = () => {
    editPhotoForm.current.classList.add("hide");
    newPhotoForm.current.classList.remove("hide");
    setEditTitle("");
    setEditId(null);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div id="profile">
      <div className="profile-header">
        {user.profile_image && (
          <img
            src={`${uploads}/user/${user.profile_image}`}
            alt={user.name}
          />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>

      {id === String(userAuth.id) && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={submitHandle}>
              <label>
                <span>Título:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>

          <div className="edit-photo hide" ref={editPhotoForm}>
            <h3>Editando Foto</h3>
            <form onSubmit={handleUpdate}>
              <label>
                <span>Novo título:</span>
                <input
                  type="text"
                  onChange={(e) => setEditTitle(e.target.value)}
                  value={editTitle || ""}
                />
              </label>
              <input type="submit" value="Atualizar" />
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                Cancelar
              </button>
            </form>
          </div>

          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}

      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <div className="photo" key={photo.id}>
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {id === String(userAuth.id) ? (
                  <div className="actions">
                    <Link to={`/photos/${photo.id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo.id)} />
                  </div>
                ) : (
                  <Link className="btn" to={`/photos/${photo.id}`}>
                    Ver
                  </Link>
                )}
              </div>
            ))
          ) : (
            <p>Ainda não há fotos publicadas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
