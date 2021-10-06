import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { SignedOut } from '../features/Actions'
import { getTokenNotExpried } from '../features/PersistentUser'

/**
 * Sign-out panel
 */
const Signout = () => {    
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
                .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString } })
                .then(() => {          
                    clearCookies()         
                    dispatch(SignedOut())         //Changing status of user to sign-out                                   
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

export default Signout
