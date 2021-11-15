import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Review } from '../features/ActionTypes'
import { ListedReview } from '../features/Actions'
import { getTokenNotExpried } from '../features/PersistentUser'
import ReviewItem from '../components/ReviewItem'
import Store from '../features/Store'

/**
 * List reviews posted by the user
 * @param {string} userId - User id
 * @param {bool} isSignedIn - presenting if user is signed in or not
 */
const MyReviews = ({ userId, isSignedIn }) => {

    // Redux selector for Review
    const ReviewStore = useSelector((state) => state.Review)

    /**
     * @typedef {Object} Review
     * @property {string} reviewId - Review id
     * @property {subject} subject - Review subject
     * @property {bool} isOwner - presenting if the user is the owner of the review or not
     * @property {string} status - Review status
     */ 
    const [reviews, setReviews] = useState()
    const [isListed, setIsListed] = useState(false)

    /**
     * Resetting isListed according to review status
     */
    if (isListed && Object.keys(ReviewStore).length !== 0 &&  ReviewStore.status === Review.POSTED_REVIEW)
    {
        setIsListed(false)
    }

    // Getting my reviews  
    useEffect(() => {  
        // Getting token not expired
        const token = getTokenNotExpried()

        if (userId && isSignedIn && token && !isListed) {
            Store.dispatch(getMyReviews(token))
        }
    }, [isListed])        

    /**
     * Dispatching ListedReview action
     */
    const dispatchListedReview = (dispatch) => {
        try {
            dispatch(ListedReview())
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Getting my reviews
     */
    const getMyReviews = (token) => (dispatch, getState) => {
        const AuthString = 'token '.concat(token)

        // Sending server a request to get my reviews
        axios
        .get(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/myreviews', { headers: { Authorization: AuthString, UserId: userId } })
        .then((response) => {    
            setReviews(response.data.reviews) 
            dispatchListedReview(dispatch)
            const review = getState().Review
            if (review) {
                setIsListed(review.status === Review.LISTED_REVIEW ? true : false)                
            }
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
