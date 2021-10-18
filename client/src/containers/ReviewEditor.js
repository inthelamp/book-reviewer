import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import RichText, { InitialValue } from '../components/RichText'
import { getTokenNotExpried } from '../features/PersistentUser'
import { PostedReview } from '../features/Actions'
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
    const history = useHistory()

    /**
     * Creating a subject because there is no subject assigned to the review
     * @param {string} content - Content of the review 
     * @returns {string} Returns subject of the review by manipulating the content
     */
    const makeSubject = (content) => {
        const searchFirstTerm = 'text'
        const searchSecondTerm = '}'
        const indexOfFirst = content.indexOf(searchFirstTerm)
        const indexOfSecond = content.indexOf(searchSecondTerm, indexOfFirst)
        const subject = content.substring(indexOfFirst+7, indexOfSecond-1).trim().replace('"', '')
        const maxSubjectSize = process.env.REACT_APP_SUBJECT_MAX_SIZE

        if (subject.length <= maxSubjectSize) {
            return subject
        } else {
            return subject.substring(0, maxSubjectSize-1)
        }
    }

    const dispatch = useDispatch()

    /**
     * Dispatching PostedReview action
     */
     const dispatchPostedReview = () => {
        try {
            dispatch(PostedReview())
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Saving review to server 
     */
    const onSave = (e) => {
        e.preventDefault();        

        // Checking if there is no review written
        if (!_.isEqual(content, JSON.stringify(InitialValue))) {

            // Checking if user is signed in
            if (userId && isSignedIn) {   

                const token = getTokenNotExpried()
                                
                // Checking if token not expired exists 
                if (token) {
                    const AuthString = 'token '.concat(token)

                    // Send request to server to save review
                    axios
                    .post(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/publish',   {  
                                                                                            subject: makeSubject(content),
                                                                                            content: content, 
                                                                                            status: 'Draft' 
                                                                                        }, 
                                                                                        { headers: { Authorization: AuthString, UserId: userId }})
                    .then((response) => {
                        setIsSaved(true)
                        setContent(JSON.stringify(InitialValue))
                        dispatchPostedReview()
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
                <Button onClick={onSave}>Save</Button>     
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
