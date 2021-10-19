import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import Store from '../features/Store'
import ReviewItem from '../components/ReviewItem'
import { Review } from '../features/ActionTypes'

describe('Component: ReviewItem', () => {
    it('Component: ReviewItem rendering correctly', () => {  
        const review = {
            reviewId: 'review-id-xxxxxx',
            subject: 'test subject',
            isOwner: true,
            status: Review.POSTED_REVIEW
        }

        const tree = renderer
          .create(<Provider store={Store}><ReviewItem review={review} /></Provider>)
          .toJSON();
        expect(tree).toMatchSnapshot()
    })
})