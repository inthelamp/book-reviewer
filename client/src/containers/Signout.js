import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { SignedOut } from '../features/Actions'
import { getTokenNotExpried } from '../features/PersistentUser'
import Store from '../features/Store'

/**
 * Sign-out panel
 */
const Signout = ( props ) => {    
    const [isSignedOut, setIsSignedOut] = useState(false)

    /**
     * @typedef {Object} User
     * @property {string} id - User id
     * @property {string} name - User name
     * @property {string} role - User role
     * @property {bool} isSignedIn - presenting if user is signed in or not
     */  
    const User =  (props.location && props.location.state && props.location.state.User) || ''

    /**
     * 
     * Sending sign-out request to server
     */
    const sendSignOut = () => (dispatch, getState) => {
        // Deleting cookies
        const clearCookies= () => {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        }

        // Getting token not expired
        const token = getTokenNotExpried()

        if (token) {
            const AuthString = 'token '.concat(token)

            // Sending sign-out request to server
            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString, UserId: User.id } })
            .then((response) => {          
                clearCookies()         
                dispatch(SignedOut())         //Changing status of user to sign-out       
                setIsSignedOut(!getState().User.isSignedIn)                       
                console.log('Sign-out', response.data.message + ' (' + User.id + ')')                                      
            })
            .catch ((error) => {   
                if (error.response) {
                    console.log(error.response.data.message)         
                    clearCookies()             
                } else {
                    console.log('Error', error.message)
                }
            })   
        } else { // Making user sign out if token is expired
            console.log('Sign-out token is expired. (' + User.id + ')')              
            clearCookies()         
            dispatch(SignedOut())            // Changing status of user to sign-out  
            setIsSignedOut(!getState().User.isSignedIn)               
        } 
    }

    // Processing sign-out   
    useEffect(() => {   
        if (!isSignedOut) {      
            Store.dispatch(sendSignOut())
        } 
    }, [isSignedOut]) 

    // Go to home page afrer sign-in
    if (isSignedOut) {
        return <Redirect to='/' />
    } else {
        return null
    }   
}

Signout.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            User: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string,
                role: PropTypes.string,
                isSignedIn: PropTypes.bool,
            }),
        }),
    }),
}

export default Signout