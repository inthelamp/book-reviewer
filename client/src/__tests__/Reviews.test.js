import renderer from 'react-test-renderer'
import Reviews from '../containers/Reviews'

describe('Component: Reviews', () => {
    it('Component: Reviews rendering correctly', () => {  
        const userId = 'dfdfdf'
        const isSignedIn = true

        const tree = renderer
          .create(<Reviews userId={userId} isSignedIn={isSignedIn} />)
          .toJSON();
        expect(tree).toMatchSnapshot()
    })
})