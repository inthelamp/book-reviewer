import { Review } from './ActionTypes'

// Review reducer
const ReviewReducer = (state = [], action) => {
    switch(action.type) {
        case Review.POSTED_REVIEW:
            return {
                ...state, 
                status: Review.POSTED_REVIEW,         
            }
            
        case Review.LISTED_REVIEW:
            return {
                ...state, 
                status: Review.LISTED_REVIEW,         
            }
            
        default:
            return state    
    }
}

export default ReviewReducer
