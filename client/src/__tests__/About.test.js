import renderer from 'react-test-renderer'
import { BrowserRouter as Router } from 'react-router-dom'
import About from '../components/About'

it('Component: About rendering correctly', () => {  
    const tree = renderer
      .create(<Router><About /></Router>)
      .toJSON();
    expect(tree).toMatchSnapshot()
})