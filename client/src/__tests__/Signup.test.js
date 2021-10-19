import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'
import Signup from '../containers/Signup'


describe('Component: Signup', () => {
    it('Component: Signup rendering correctly', () => {  

        const tree = renderer
            .create(<Router><Signup /></Router>)
            .toJSON();
        expect(tree).toMatchSnapshot()
    })
})