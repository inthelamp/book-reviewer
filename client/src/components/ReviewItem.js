import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

/**
 * @typedef {Object} Review
 * @property {string} id - Review id
 * @property {string} title - Review title
 * @property {string} status - Review status
 */ 
/**
 * Displaying review title and button
 * @param {Review} review - Review object 
 */
const ReviewItem = ( { review } ) => {
    const history = useHistory();

    const onSubmit = (e) => {        
        e.preventDefault()

        history.push(
            { 
                pathname: '/',
                state: { Review: review }
            }
        )
    }

    return ( 
        <div>
            {review.title} &nbsp;
            <Button className="float-end" variant='secondary' size="sm" onClick={(e) => onSubmit(e)}>
                Read
            </Button>
        </div>
    )
}

ReviewItem.propTypes = {
    review: PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            status: PropTypes.string        
    })
}

export default  ReviewItem