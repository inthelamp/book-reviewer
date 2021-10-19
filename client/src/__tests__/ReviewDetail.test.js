import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import ReviewDetail from '../components/ReviewDetail'
import { Review } from '../features/ActionTypes'
import Store from '../features/Store'


describe('Component: ReviewDetail', () => {
    it('Component: ReviewDetail rendering correctly', () => {  

        const userId = 'aaaaa'
        const isSignedIn = true
        const review = {
            reviewId: 'review-id-xxxxxx',
            subject: 'test subject',
            isOwner: true,
            status: Review.POSTED_REVIEW
        }

        const tree = renderer
          .create(<Provider store={Store}><ReviewDetail userId={userId} isSignedIn={isSignedIn} review={review} /></Provider>)
          .toJSON();
        expect(tree).toMatchSnapshot()
    })
})