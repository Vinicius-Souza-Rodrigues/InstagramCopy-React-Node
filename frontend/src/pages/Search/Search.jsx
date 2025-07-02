import "./Search.css"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage"
import { useQuery } from "../../hooks/useQuery"

import LikeContainer from "../../components/LikeContainer"
import PhotoItem from "../../components/PhotoItem"
import { Link } from "react-router-dom"
import { searchPhotos } from "../../slices/photoSlice"



const Search = () => {

    const query = useQuery()
    const search = query.get('q')

    const dispatch = useDispatch()

    const resetMessage = useResetComponentMessage(dispatch)

    const { user } = useSelector(state => state.auth)
    const { photos, loading } = useSelector(state => state.photo)

    useEffect(() => {
        dispatch(searchPhotos(search))
    }, [dispatch, search])

    const handleLike = (photo) => {
            dispatch(like(photo.id))
    
            resetMessage()
        }
    
        if (loading) {
            return <p>Carregando...</p>
        }

  return (
    <div id="search">
        <h2>Você está buscando por:{search}</h2>
            {photos && photos.map((photo) => (
                <div key={photo.id}>
                    <PhotoItem photo={photo}/>
                    <LikeContainer photo={photo} user={user} handleLike={handleLike}/>
                    <Link className='btn' to={`/photos/${photo.id}`}>Ver mais</Link>
                </div>
            ))}

        {photos && photos.length === 0 && (
            <h2 className="no-photos">
                Não foi encotrado fotos... <Link to={`/user/${user.userId}`}>Clique aqui</Link>
            </h2>
        )}
    </div>
  )
}

export default Search
