import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import RichText, { InitialValue } from '../components/RichText'
import { getTokenNotExpried } from '../features/PersistentUser'
import Message from '../components/Message'

// for checking array equality
const _ = require('lodash');

/**
 * Review Editor where user is typing, updating and saving a book review
 * @param {string} id - User id
 * @param {bool} isSignedIn - Presenting if user is signed in or not
 */
const ReviewEditor = ( { userId, isSignedIn } )  => {    
    const [message, setMessage] = useState('')
    const [messageStyle, setMessageStyle] = useState('')
    const [isSaved, setIsSaved] = useState(false)
    const [content, setContent] = useState(localStorage.getItem('content') || JSON.stringify(InitialValue))
    const token = getTokenNotExpried()    
    const history = useHistory()

    /**
     * Saving review to server 
     */
    const onSave = (e) => {
        e.preventDefault();        

        // Checking if there is no review written
        if (!_.isEqual(content, JSON.stringify(InitialValue))) {

            // Checking if user is signed in
            if (userId && isSignedIn) {   

                // Checking if token not expired exists 
                if (token) {
                    const AuthString = 'token '.concat(token)

                    // Send request to server to save review
                    axios
                    .post(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/publish',   {  
                                                                                            title: 'What is a good review?',
                                                                                            content: content, 
                                                                                            status: 'Draft' 
                                                                                        }, 
                                                                                        { headers: { Authorization: AuthString, UserId: userId }})
                    .then((response) => {
                        setIsSaved(true)
                        setContent(JSON.stringify(InitialValue))
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
                        setContent(InitialValue)
                    })
                }
            } else {
                history.push('/signin')
            }  
        } else {
            setMessageStyle('error_message')
            setMessage('No review is written.') 
        }
    }

    // Initalizing states when review is saved
    useEffect(() => {
        const initialize = () => {
            setMessage('')
            setIsSaved(false)
        }

        if (isSaved && message && !_.isEqual(content, JSON.stringify(InitialValue))) {
            initialize()
        }
    }, [isSaved, message, content])

    return (
        <>
            <RichText  setContent={setContent} reset={isSaved} />
            <div className='App-Buttons'>
                <br />
                <Button onClick={e => onSave(e)}>Save</Button>     
                <Message message={message} messageStyle={messageStyle}/>                         
            </div>
        </>
    )
}

ReviewEditor.propTypes = {
    userId: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired
}

export default ReviewEditor
