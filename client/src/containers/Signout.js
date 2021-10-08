import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { SignedOut } from '../features/Actions'
import { getTokenNotExpried } from '../features/PersistentUser'

/**
 * Sign-out panel
 */
const Signout = ( props ) => {    
    /**
     * @typedef {Object} User
     * @property {string} id - User id
     * @property {string} name - User name
     * @property {string} role - User role
     * @property {bool} isSignedIn - presenting if user is signed in or not
     */  
    const User =  (props.location && props.location.state && props.location.state.User) || ''

    // Getting token not expired
    const token = getTokenNotExpried()

    // Deleting cookies
    const clearCookies= () => {
       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }

    const dispatch = useDispatch()

    // Processing sign-out   
    useEffect(() => {  
        let isMounted = true       

        if (isMounted) {      
            if (token) {
                const AuthString = 'token '.concat(token)

                // Sending sign-out request to server
                axios
                .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString, UserId: User.id } })
                .then((response) => {          
                    clearCookies()         
                    dispatch(SignedOut())         //Changing status of user to sign-out    
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
                clearCookies()         
                dispatch(SignedOut())            // Changing status of user to sign-out  
            }         
        } 
        return () => { isMounted = false };  //clean up
    }, [token, dispatch]); 

    return  <Redirect to='/' />
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
