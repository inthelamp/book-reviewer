import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import axios from 'axios'
import { Review } from '../features/ActionTypes'
import { ListedReview } from '../features/Actions'
import { getTokenNotExpried } from '../features/PersistentUser'
import ReviewItem from '../components/ReviewItem'

/**
 * List reviews posted by the user
 * @param {string} userId - User id
 * @param {bool} isSignedIn - presenting if user is signed in or not
 */
const MyReviews = ({ userId, isSignedIn }) => {
    // Redux selector for Review status
    const ReviewStore = useSelector((state) => state.Review)

    /**
     * @typedef {Object} Review
     * @property {string} reviewId - Review id
     * @property {subject} subject - Review subject
     * @property {bool} isOwner - presenting if the user is the owner of the review or not
     * @property {string} status - Review status
     */ 
    const [reviews, setReviews] = useState()

    // Getting token not expired
    const token = getTokenNotExpried()

    const dispatch = useDispatch()

    /**
     * Dispatching ListedReview action
     */
     const dispatchListedReview = () => {
        try {
            dispatch(ListedReview())
        } catch (error) {
            console.log(error)
        }
    }

    // Getting my reviews  
    useEffect(() => {  
        if (userId && isSignedIn && token && ReviewStore.status !== Review.LISTED_REVIEW) {      
            const AuthString = 'token '.concat(token)

            // Sending server a request to get my reviews
            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/myreviews', { headers: { Authorization: AuthString, UserId: userId } })
            .then((response) => {    
                setReviews(response.data.reviews) 
                dispatchListedReview()
                console.log(response.data.message)                      
            })
            .catch ((error) => {   
                if (error.response) {
                    console.log(error.response.data.message)              
                } else {
                    console.log('Error', error.message)
                }
            })   
        } 
    }, [token, ReviewStore.status]); 

    return (<>
                {reviews ? ( <ListGroup className='scrollable'>
                                {reviews.map((review, i) => <ListGroup.Item key={i}><ReviewItem review={review} /></ListGroup.Item>)}                  
                            </ListGroup>) : null
                }
            </>
    )
}

MyReviews.propTypes = {
    userId: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired
}

export default MyReviews
