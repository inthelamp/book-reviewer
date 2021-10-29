import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { NavLink, Redirect } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Store from '../features/Store'
import Message from '../components/Message'
import { SignedIn } from '../features/Actions'
import './Signin.css'

/**
 * Sign-in panel
 */
const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageStyle, setMessageStyle] = useState('')
    const [isSignedIn, setIsSignedIn] = useState(false)

    /**
     * @typedef {Object} User
     * @property {string} id - User id
     * @property {string} name - User name
     * @property {string} role - User role
     */  
    const [User, setUser] = useState()

    /**
     * Adding hours to current time 
     * @param {date} date - current date time
     * @param {number} hours  - hours to be added
     * @returns {date} return sum of date time and hours
     */
    const addHours = (date, hours) => {
        return date.getTime() + (hours*60*60*1000)
    }

    /**
     * Saving value to cookie
     * @param {string} cookieName - key for the cookie
     * @param {any} value - value to be stored
     */
    const setCookie = (cookieName, value) => {
        const today = new Date()
        today.setTime(addHours(today, process.env.REACT_APP_COOKIE_SUSTAINING_HOURS))
        const expires = 'expires='+ today.toUTCString()
        document.cookie = cookieName + '=' + value + '; SameSite=strict; Secure;' + expires + '; path=/'
    }
  
    /**
     * Getting user information from token
     * @param {string} token - token from which id, name and role are derived 
     * @returns {User} returns user information
     */
    const getUser = (token) => {
      if (token) {      
        try {
            const user = jwt_decode(token)
            return user
        } catch (error) {
            console.log(error)
        }
      } 

      return null
    }
    
    /**
     * Dispatching SignedIn action
     * @param {User} user - user information 
     */
    const dispatchSignedIn = (dispatch, user) => {
      if (user) {      
        try {
            const {id, name, role} = user  
            dispatch(SignedIn(id, name, role))
        } catch (error) {
            console.log(error)
        }
      } 
    }

    /**
     * 
     * Sending sign-in request to server
     */
    const sendSignIn = () => (dispatch, getState) => {
      axios
      .post(process.env.REACT_APP_SERVER_BASE_URL + '/users/signin', {email, password})
      .then((response) => {
          setCookie('token', response.data.accessToken) // Saving token to cookie
          let user = getUser(response.data.accessToken)
          dispatchSignedIn(dispatch, user) 
          user = getState().User  
          if (user) {
            setUser(user)
            setIsSignedIn(user.isSignedIn)
            console.log('Sign-in', response.data.message + ' (' + user.id + ')') 
          } else {
            setMessageStyle('error_message')      
            setMessage('Unable to sign in, please try later!')  
            setIsSignedIn(false)      
          }
      })
      .catch ((error) => { 
          if (error.response) {           
            setMessageStyle('error_message')         
            setMessage(error.response.data.message)    
            setIsSignedIn(false)  //fixing the errors: Cannot log after tests are done, Attempted to log "Warning: Can't perform a React state update on an unmounted component."            
          } else {
            console.log('Error', error.message)
          }
      })
    }

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        }
    }

    // Processing sign-in
    const handleSubmit = (e) => {
        e.preventDefault()
        Store.dispatch(sendSignIn())
    }

    /**
    * Checking if email and password are provided
    */
    const isValid = () => {
        return email.length > 0 && password.length > 0
    }  

    // Go to home page afrer sign-in
    if (isSignedIn) {
        return <Redirect to={{
              pathname: '/',
              state: { User }
        }}
        />
    }

    // Only for testing
    // const Input = (props) => <Form.Control {...props} />    

    return (
      <div className='signin'>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3' size='lg' controlId='email'>
            <Form.Label>Email</Form.Label>
            {/* Only for testing
               <Input 
            */}    
          <Form.Control 
              autoFocus
              name='email'              
              type='email'
              value={email}
              onChange={handleChange}
          />
          </Form.Group>
          <Form.Group className='mb-3' size='lg' controlId='password'>
            <Form.Label>Password</Form.Label>
            {/* Only for testing
                <Input 
            */}   
            <Form.Control
              type='password'
              name='password'
              data-testid='password'
              value={password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button size='lg' type='submit' disabled={!isValid()} > 
            Sign In
          </Button>
          <Message message={message} messageStyle={messageStyle}/>
          <p>New Book Reviewer?&nbsp;<NavLink to='/signup'>Create an account</NavLink></p>
        </Form>      
      </div>
    )
}

export default Signin