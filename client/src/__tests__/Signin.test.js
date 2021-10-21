import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'
import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Signin from '../containers/Signin'


describe('Component: Signin', () => {
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

      it('check submit', () => {
        expect(wrapper.find('form')).toHaveLength(1)
        const formEventMocked = { preventDefault: jest.fn() }
        wrapper.find('form').simulate('submit', formEventMocked)
        expect(formEventMocked.preventDefault).toBeCalledTimes(1)
      })
  })
})