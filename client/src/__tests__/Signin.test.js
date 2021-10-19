import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import Store from '../features/Store'
import Signin from '../containers/Signin'


describe('Component: Signin', () => {
    it('Component: Signin rendering correctly', () => {  

        const tree = renderer
            .create(<Provider store={Store}><Router><Signin /></Router></Provider>)
            .toJSON();
        expect(tree).toMatchSnapshot()
    })
})