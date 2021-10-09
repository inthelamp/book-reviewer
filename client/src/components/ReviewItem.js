import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { ChangedModeToBrowse } from '../features/Actions'

/**
 * @typedef {Object} Review
 * @property {string} reviewId - Review id
 * @property {subject} subject - Review subject
 * @property {bool} isOwner - presenting if the user is the owner of the review or not
 * @property {string} status - Review status
 */ 
/**
 * Displaying review subject and button
 * @param {Review} review - Review object 
 */
const ReviewItem = ( { review } ) => {

    const dispatch = useDispatch()
    
    /**
     * Dispatching ChangedModeToBrowse action
     */
    const dispatchChangedModeToBrowse = (review) => {
        try {
            dispatch(ChangedModeToBrowse(review))
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = (e) => {        
        e.preventDefault()

        dispatchChangedModeToBrowse(review)
    }

    return ( 
        <div>
            {review.subject} &nbsp;
            <Button className='float-end' variant='secondary' size='sm' onClick={(e) => onSubmit(e)}>
                Read
            </Button>
        </div>
    )
}

ReviewItem.propTypes = {
    review: PropTypes.shape({
            id: PropTypes.string,
            subject: PropTypes.string,
            status: PropTypes.string        
    })
}

export default  ReviewItem