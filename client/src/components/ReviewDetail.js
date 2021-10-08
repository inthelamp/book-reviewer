import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'
import ReadOnlyText from './ReadOnlyText'

const ReviewDetail = ( props ) => { 
    const [detail, setDetail] = useState()
    /**
     * @typedef {Object} Review
     * @property {string} reviewId - Review id
     * @property {string} title - Review title
     * @property {string} status - Review status
     */ 
    const Review =  (props.location && props.location.state && props.location.state.Review) || ''

    // Getting a review  
    useEffect(() => {  
        let isMounted = true

        if (isMounted && Review.reviewId) {
            // Sending server a request to get others' reviews
            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/reviews/' + Review.reviewId)
            .then((response) => {    
                setDetail(response.data.detail)               
                console.log(detail)         
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

        return () => { isMounted = false };  //clean up
    }, [Review.reviewId]); 

    return (
        <div>
            <h3>Title</h3>
            <Alert variant='dark'>{Review.title}</Alert>
            {detail ? <ReadOnlyText content={detail.content} /> : null }
        </div>
    )
}

ReviewDetail.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            Review: PropTypes.shape({
                reviewId: PropTypes.string,
                title: PropTypes.string,
                status: PropTypes.string        
            })
        })
    })
}

export default ReviewDetail
