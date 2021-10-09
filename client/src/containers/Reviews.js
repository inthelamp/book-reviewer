import PropTypes from 'prop-types'
import MyReviews from '../components/MyReviews'
import OtherReviews from '../components/OtherReviews'
import './Review.css'

/**
 * Reviews posted
 */
const Reviews = ( {userId, isSignedIn }) => {

    return (
        <div className='review'>
            { isSignedIn ? ( <div>
                                <h4>My Reviews</h4> 
                                <MyReviews userId={userId} isSignedIn={isSignedIn}/> 
                             </div>
                           ) : '' }
            <>
                <h4>Reviews</h4>
                <OtherReviews userId={userId} />
            </>
        </div>
    )
}

Reviews.propTypes = {
    userId: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired
}

export default Reviews