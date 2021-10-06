import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import Message from '../components/Message'
import './Activate.css'

const Activate = ( props ) => {
    const [code, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [messageStyle, setMessageStyle] = useState('')

    const email =  (props.location && props.location.state.email) || ''

    const onSubmit = (e) => {
        e.preventDefault()

        axios
        .patch(process.env.REACT_APP_SERVER_BASE_URL + '/users/activate', { email, code })
        .then((response) => {
            setCode('')
            setMessageStyle('success_message')   
            setMessage(response.data.message)
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

    const isValid = () => {
        return code.length > 0
    }

    return (
        <div className='activate'>
            <Form onSubmit={onSubmit}>
                <Alert variant='success'>
                    Your information is saved sucessfully.
                    To activate your account,
                    please <b>submit</b> the <b>authentication code</b>
                    &nbsp;sent to your email.
                </Alert>    
                <Form.Group size='lg' controlId='email'>
                <Form.Control
                    autoFocus
                    required
                    type='text'
                    value={code}
                    placeholder='Enter authentication code'
                    onChange={(e) => setCode(e.currentTarget.value)}
                />
                </Form.Group> 
                <Button size='lg' type='submit' disabled={!isValid()} >
                    Activate
                </Button>                
                <Message message={message} messageStyle={messageStyle}/>
            </Form>
        </div>
    )
}

Activate.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            email: PropTypes.string.isRequired,
        }),
    }),
}

export default Activate