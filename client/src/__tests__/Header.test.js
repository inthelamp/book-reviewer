import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import Store from '../features/Store'
import Header from "../components/Header"

describe('Component: Header', () => {
    it('checking existing', () => {
        const wrapper = shallow(<Provider store={Store}><Router><Header /></Router></Provider>)
        expect(wrapper.exists()).toBe(true);
    })

    it('rendering correctly', () => {  
        const tree = renderer
          .create(<Provider store={Store}><Router><Header /></Router></Provider>)
          .toJSON();
        expect(tree).toMatchSnapshot()
    })

    it('rendering menus', () => {
      const wrapper = mount(<Provider store={Store}><Router><Header /></Router></Provider>); 
      const signIn = wrapper.find('a.nav-link');
      const home = wrapper.find('a.navbar-brand');
    
      expect(signIn.getDOMNode().textContent).toEqual('Sign In');
      expect(home.getDOMNode().textContent).toEqual('Book Reviewer');
    })    
})