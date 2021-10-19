import React from 'react'
import { Route } from 'react-router-dom'
import { shallow } from 'enzyme'
import App from '../App'
import Header from '../components/Header'
import Footer from '../components/Footer'
import About from '../components/About'
import Home from '../containers/Home'
import Signin from '../containers/Signin'
import Signout  from '../containers/Signout'
import Signup from '../containers/Signup'
import Activate from '../containers/Activate'

it('Component: App', () => {
    shallow(<App />);
})

describe('App Components', () => {
    it('Component: Header', () => {
        const wrapper = shallow(<App />)
        const header = <Header component={ Header } />
        expect(wrapper.contains(header)).toEqual(true)
    })
      
    it('Component: Footer', () => {
        const wrapper = shallow(<App />)
        const footer = <Footer />
        expect(wrapper.contains(footer)).toEqual(true)
    })
    
    it('Component: Home', () => {
        const wrapper = shallow(<App />)
        const home = <Route path='/' exact component={ Home } />
        expect(wrapper.contains(home)).toEqual(true)
    })
    
    it('Component: Sign-in', () => {
        const wrapper = shallow(<App />)
        const signin = <Route path='/signin' component={ Signin } />
        expect(wrapper.contains(signin)).toEqual(true)
    })
    
    it('Component: Sign-up', () => {
        const wrapper = shallow(<App />)
        const signup = <Signup />
        expect(wrapper.contains(signup)).toEqual(true)
    })
    
    it('Component: Sign-out', () => {
        const wrapper = shallow(<App />)
        const signout = <Route path='/signout' component={ Signout } />
        expect(wrapper.contains(signout)).toEqual(true)
    })
    
    
    it('Component: Activate', () => {
        const wrapper = shallow(<App />)
        const activate = <Route path='/activate' component={ Activate } />
        expect(wrapper.contains(activate)).toEqual(true)
    })

    it('Component: About', () => {
        const wrapper = shallow(<App />)
        const about = <Route path='/about' component={ About } />
        expect(wrapper.contains(about)).toEqual(true)
    })    
})