import { shallow, mount } from 'enzyme'
import { render } from "@testing-library/react";
import { Provider } from 'react-redux';
import Store from '../features/Store'
import Home from '../containers/Home'
  
describe('Component: Home', () => {
	it('Should create the Home component', () => {
		const home = shallow(<Provider store={Store}><Home /></Provider> )
		expect(home).toBeTruthy();
	})

    it("contains My Reviews if in sign-in", () => {
        const state = {
            User: {
                id: 'asasdfdfdfdfdfdfdfdfd',
                name: 'Smith',
                role: 'user',
                isSignedIn: true,
            }
        }

        const { getByText } = render(
            <Provider store={Store}>   
                <Home location={{ state }} />
            </Provider>
        )
      
        getByText('My Reviews')
    })

    it("not contain My Reviews if not in sign-in", () => {
        const state = {
            User: {
                id: 'asasdfdfdfdfdfdfdfdfd',
                name: 'Smith',
                role: 'user',
                isSignedIn: false,
            }
        }

        const { getByText } = render(
            <Provider store={Store}>   
                <Home location={{ state }} />
            </Provider>
        )
      
        getByText('My Reviews')
    })
  })
  