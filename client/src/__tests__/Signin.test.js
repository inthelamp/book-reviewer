import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { screen, render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Signin from '../containers/Signin'


describe('Component: Signin', () => {
  afterEach(cleanup)

  it('rendering correctly', () => {  

      const tree = renderer
          .create(<Router><Signin /></Router>)
          .toJSON()
      expect(tree).toMatchSnapshot()
  })

  it('rendering basic fields', () => {
      render(<Router><Signin /></Router>)
      expect(
        screen.getByRole('textbox', { name: 'Email' }))
        .toBeInTheDocument()
      expect(
        screen.getByText(/password/i))
        .toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Sign In' }))
        .toBeInTheDocument()
  })

  describe('Testing input onChange function', () => {
      let wrapper

      beforeEach(() => {
        wrapper = mount(<Router><Signin /></Router>)
      })

      it('Email input', () => {
        wrapper.find('Input').at(0).simulate('change', { target: { name: 'email', value: 'abc@company.com' } })
        expect(wrapper.find('Input').at(0).props().value).toEqual('abc@company.com')
      })

      it('Password input', () => {
        wrapper.find('Input').at(1).simulate('change', { target: { name: 'password', value: 'abcdef' } })
        expect(wrapper.find('Input').at(1).props().value).toEqual('abcdef')
      })
  })

  describe('Testing onSubmit function', () => {
      let wrapper

      beforeEach(() => {
        wrapper = mount(<Router><Signin /></Router>)
      })
      
      afterEach(() => {
        jest.resetAllMocks()
      })

      it('calling submit function', () => {
        const handleSubmitMocked = { preventDefault: jest.fn() }   
        expect(wrapper.find('form')).toHaveLength(1)         
        wrapper.find('form').simulate('submit', handleSubmitMocked)
        expect(handleSubmitMocked.preventDefault).toBeCalledTimes(1)
      })
  })

  //Don't change the testing order. 
  describe('Testing sign-in', () => {  
    let email
    let password
    let submit 

    beforeEach(()=> {
      render(<Router><Signin /></Router>)   

      email = screen.getByRole('textbox', { name: 'Email' })
      password = screen.getByTestId('password')
      submit = screen.getByRole('button')
    })

    afterEach(cleanup)

    it('Testing with wrong password', async () => {   
      await waitFor(() => {   
        fireEvent.change(email, { target: { name: 'email', value: 'a@t1.com' } }) 
        fireEvent.change(password, { target: { name: 'password', value: 'xxxxxxxxxx' } })  
        fireEvent.submit(submit)   

        expect(screen.getByTestId('message').textContent).toBe('Please enter right email and password.')  
      })             
    })   

    it('Testing with right password', async () => {
      console.log = jest.fn()

      await waitFor(() => {       
        fireEvent.change(email, { target: { name: 'email', value: 'a@t1.com' } }) 
        fireEvent.change(password, { target: { name: 'password', value: 'BczPsiPcb6JgPs4' } })  
        fireEvent.submit(submit)

        expect(console.log.mock.calls[0][1].substring(0,31)).toEqual('User is signed in successfully.')
      })
    })     
  })       
})   