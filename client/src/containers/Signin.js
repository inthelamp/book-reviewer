import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { NavLink, Redirect } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
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

    const dispatch = useDispatch()
    
    /**
     * Dispatching SignedIn action
     * @param {User} user - user information 
     */
    const dispatchSignedIn = (user) => {
      if (user) {      
        try {
            const {id, name, role} = user  
            dispatch(SignedIn(id, name, role))
        } catch (error) {
            console.log(error)
        }
      } 
    }

    // Processing sign-in
    const onSubmit = (e) => {
      e.preventDefault()

      // Sending sign-in request to server
      axios
      .post(process.env.REACT_APP_SERVER_BASE_URL + '/users/signin', {email, password})
      .then((response) => {
          setCookie('token', response.data.accessToken) // Saving token to cookie
          let user = getUser(response.data.accessToken)
          setUser({id: user.id, name: user.name, role: user.role, isSignedIn: true})          
          dispatchSignedIn(user)
          setIsSignedIn(true)
          console.log('Sign-in', response.data.message + ' (' + user.id + ')')
      })
      .catch ((error) => {
          setMessageStyle('error_message')      
          if (error.response) {
            setMessage(error.response.data.message)                
          } else {
            console.log('Error', error.message)
          }
      })
    }

    /**
    * Checking if email and password are provided
    */
    const isValid = () => {
      return email.length > 0 && password.length > 0
    }  

    // Go to home page afrer sign-in
    if (isSignedIn) {
        return <Redirect  to={{
              pathname: '/',
              state: { User }
        }}
        />
    }

    return (
      <div className='signin'>
        <Form onSubmit={onSubmit}>
          <Form.Group size='lg' controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type='email'
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
          />
          </Form.Group>
          <Form.Group size='lg' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
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