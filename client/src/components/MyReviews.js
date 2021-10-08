import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import axios from 'axios'
import { getTokenNotExpried } from '../features/PersistentUser'
import ReviewItem from '../components/ReviewItem'

/**
 * List reviews posted by the user who is signed in
 * @param {string} userId - User id
 * @param {bool} isSignedIn - presenting if user is signed in or not 
 */
const MyReviews = ( { userId, isSignedIn }) => {
    /**
     * @typedef {Object} Review
     * @property {string} reviewId - Review id
     * @property {title} title - Review title
     * @property {string} status - Review status
     */ 
    const [reviews, setReviews] = useState()

    // Getting token not expired
    const token = getTokenNotExpried()

    // Getting my reviews  
    useEffect(() => {  
        if (userId && isSignedIn && token) {      
            const AuthString = 'token '.concat(token)

            // Sending server a request to get my reviews
            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/myreviews', { headers: { Authorization: AuthString, UserId: userId } })
            .then((response) => {    
                setReviews(response.data.reviews)      
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
    }, [token]); 

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
