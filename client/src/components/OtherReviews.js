import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import axios from 'axios'
import ReviewItem from '../components/ReviewItem'

/**
 * List other reviews not posted by the user who is signed in
 * @param {string} userId - User id
 */
const OtherReviews = ( { userId }) => {
    /**
     * @typedef {Object} Review
     * @property {string} reviewId - Review id
     * @property {title} title - Review title
     * @property {string} status - Review status
     */ 
    const [reviews, setReviews] = useState()

    // Getting other reviews   
    useEffect(() => {  
        // Sending server a request to get others' reviews
        axios
        .get(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/reviews', { headers: { UserId: userId } })
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
    }, [userId]); 

    return (<>
                {reviews ? ( <ListGroup className='scrollable'>
                                {reviews.map((review, i) => <ListGroup.Item key={i}><ReviewItem review={review} /></ListGroup.Item>)}                  
                            </ListGroup>) : null
                }
            </>
    )
}

OtherReviews.propTypes = {
    userId: PropTypes.string
}

export default OtherReviews