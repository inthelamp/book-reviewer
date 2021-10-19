import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import Store from '../features/Store'
import Header from "../components/Header"

it('Component: Header rendering correctly', () => {  
    const tree = renderer
      .create(<Provider store={Store}><Router><Header /></Router></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot()
})