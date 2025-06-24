import "./Profile.css"

import { uploads } from "../../utils/config"

import Message from "../../components/Message"
import { Link } from "react-router-dom"
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs"

import { useState, useEffect, useRef} from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { getUserDetails, resetMessage } from "../../slices/userSlice"
import { publishPhoto, getUserPhotos, deletePhoto } from "../../slices/photoSlice"

const Profile = () => {

    const { id } = useParams()

    const dispatch = useDispatch()

    const { user, loading } = useSelector((state) => state.user)
    const { user: userAuth} = useSelector((state => state.auth))
    const { photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto } = useSelector((state => state.photo))
    
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")

    const newPhotoForm = useRef()
    const editPhotoForm = useRef()

    useEffect(() => {
        dispatch(getUserDetails(id))
        dispatch(getUserPhotos(id))
    }, [dispatch, id])

     const handleFile = (e) => {
    // image preview
    const image = e.target.files[0];

    // change image state
    setImage(image);
  };

  const resetComponentMessage = () => {
    setTimeout(() => {
            dispatch(resetMessage());
        }, 2000)
  }

    const submitHandle = (e) => {
        e.preventDefault();

        const photoData = {
            title,
            image,
        }

        const formData = new FormData()

        const photoFormData = Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]))

        formData.append("photo", photoFormData)

        dispatch(publishPhoto(formData))

        setTitle("")

        resetComponentMessage()
    }

    const handleDelete = (id) => {

        dispatch(deletePhoto(id)).then(() => {
            dispatch(getUserPhotos(userAuth.id))
        })

        resetComponentMessage()
    }

    if (loading) {
        return <p>Carregando...</p>
    }

  return (
    <div id="profile">
        <div className="profile-header">
            {user.profile_image && (
                <img src={`${uploads}/user/${user.profile_image}`} alt={user.name} />
            )}
            <div className="profile-description">
                <h2>{user.name}</h2>
                <p>{user.bio}</p>
            </div>
        </div>

        {id === String(userAuth.id) && (
            <>
                <div className="new-photo" ref={newPhotoForm}>
                    <h3>Compartilhe algum momento eu:</h3>
                    <form onSubmit={submitHandle}>
                        <label>
                            <span>Titulo para a foto:</span>
                            <input type="text" placeholder="Insira um titulo" onChange={(e) => setTitle(e.target.value)} value={title || ""} />
                        </label>
                        <label>
                            <span>Imagem</span>
                            <input type="file" onChange={handleFile}/>
                        </label>
                        {!loadingPhoto && <input type="submit" value="Postar" />}
                        {loadingPhoto && <input type="submit" value="Aguarde..." disabled />}
                    </form>
                </div>

                <div className="edit-photo hide" ref={editPhotoForm}>
                    <p>Editando:</p>
                </div>
                {errorPhoto && <Message msg={errorPhoto} type="error"/>}
                {messagePhoto && <Message msg={messagePhoto} type="success"/>}
            </>
        )}
        <div className="user-photos">
            <h2>Fotos publicadas:</h2>
            <div className="photos-container">
                {photos && photos.map((photo) => (
                    <div className="photo" key={photo.id}>
                        {photo.image && (<img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />)}
                        {id === String(userAuth.id) ? (
                            <div className="actions">
                                <Link to={`/photos/${photo.id}`}>
                                    <BsFillEyeFill />
                                </Link>
                                <BsPencilFill />
                                <BsXLg onClick={() => handleDelete(photo.id)}/>
                            </div>
                        ) : (
                            <Link className="btn" to={`/photos/${photo.id}`}>
                                Ver
                            </Link>
                        )}
                    </div>
                ))}
                {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
            </div>
        </div>
    </div>
  )
}

export default Profile
