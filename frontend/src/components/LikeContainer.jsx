import './LikeContainer.css'

import {BsHeartFill, BsHeart} from 'react-icons/bs'

const LikeContainer = ({photo, user, handleLike}) => {
  return (
    <div className='like'>
        {photo.likes && user && (
            <>
                {photo.likes.includes(user.id) ? (
                    <BsHeartFill />
                ) : (
                    <BsHeart onClick={() => handleLike(photo)}/>
                )}
                <p>{photo.likes.length} likes(s)</p>
            </>
        )}
    </div>
  )
}

export default LikeContainer
