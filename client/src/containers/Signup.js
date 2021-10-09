import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Message from '../components/Message'
import './Signup.css'

/**
 * Sign-up panel
 */
const Signup = () => {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('') 
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')  
  const [message, setMessage] = useState('')
  const [messageStyle, setMessageStyle] = useState('')
  const [isSignedUp, setIsSignedUp] = useState(false)

  /**
  * Checking input values
  */
  const isValid = () => {
    return email.length > 0 && userName.length > 0 && password.length > 0 && confirmPassword.length > 0 && password === confirmPassword
  }  

  // Processing sign-up
  const onSubmit = (e) => {
    e.preventDefault();

    // Sending sign-up request to server
    axios
    .post(process.env.REACT_APP_SERVER_BASE_URL + '/users/signup', {email, userName, password, confirmPassword})
    .then(() => {
        setIsSignedUp(true)
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

  // Checking password when it changes
  const onChangePassword = (e) => {    
    setPassword(e.currentTarget.value)

    if (confirmPassword) {
      if (e.currentTarget.value !== confirmPassword) {
        let message = 'These passwords don’t match.'
        setMessage(message)
        setMessageStyle('error_message')
      } else {     
        setMessage('')
        setMessageStyle('')            
      }
    } else {
      setMessage('')
      setMessageStyle('')      
    }
  } 

  // Checking confirm password when it changes
  const onChangeConfirmPassword = (e) => {    
    setConfirmPassword(e.currentTarget.value)

    if (e.currentTarget.value !== password) {
      let message = 'These passwords don’t match.'
      setMessage(message)
      setMessageStyle('error_message')
    } else {     
      setMessage('')
      setMessageStyle('')            
    }
  }

  // Go to home page when sign-up completes
  if (isSignedUp) {
    return <Redirect to={{
            pathname: '/activate',
            state: { email }
          }} />
  }

  return (
    <div className='signup'> 
      <Form onSubmit={onSubmit}>
      <Form.Group class='mb-3' size='lg' controlId='email'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          autoFocus
          type='email'
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
      />
      </Form.Group>      
      <Form.Group className='mb-3' size='lg' controlId='userName'>
        <Form.Label>User Name</Form.Label>
        <Form.Control
          type='text'
          value={userName}
          onChange={(e) => setUserName(e.currentTarget.value)}
      />      
      </Form.Group>
      <Form.Group className='mb-3' size='lg' controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control className='mb-3'
          type='password'
          value={password}
          onChange={onChangePassword}
        />
        <Form.Label>Password Confirm</Form.Label>        
        <Form.Control
          type='password'
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />          
      </Form.Group>
      <Button size='lg' type='submit' disabled={!isValid()} >
        Sign Up
      </Button>
      <Message message={message} messageStyle={messageStyle}/>
    </Form>      
   </div> 
  )
}

export default Signup
