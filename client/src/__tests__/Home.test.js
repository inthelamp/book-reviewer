import { shallow } from 'enzyme'
// import renderer from 'react-test-renderer'
// import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import Store from '../features/Store'
import Home from '../containers/Home'

const user = {
    id: 'sdfdfdfdfdfdfdfdfdfdfd',
    name: 'Smith',
    role: 'user',
    isSignedIn: true,
};
  
describe('Component: Home', () => {
	it('Should create the Home component', () => {
		const home = shallow(
            <Provider store={Store}>      
			    ShallowMock(<Home />, user)
            </Provider> 
		)
		expect(home).toBeTruthy();
	})

    // it("accepts user account props", () => {
	// 	const home = shallow(
    //         <Provider store={Store}>      
	// 		    <Home  user={user} />
    //         </Provider> 
	// 	)
    //     console.log(home.props())
    //     expect(home.props().user).toEqual(user);
    // })

    // it("contains users account email", () => {
    //     const wrapper = mount(<Account user={user} />);
    //     const value = wrapper.find("p").text();
    //     expect(value).toEqual("david@gmail.com");
    // })

    // it('Component: Home rendering correctly', () => {  
    //     const props = { ...user }

    //     const tree = renderer
    //       .create(<Provider store={Store}><Router><Home {...props}/></Router></Provider>)
    //       .toJSON();
    //     expect(tree).toMatchSnapshot()
    // })
  })
  