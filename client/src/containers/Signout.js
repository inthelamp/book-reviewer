import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { SignedOut } from '../features/Actions'
import { getTokenNotExpried } from '../features/PersistentUser'

const Signout = () => {    
    const token = getTokenNotExpried()

    //Delete cookies
    const clearCookies= () => {
       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }

    const dispatch = useDispatch()

    useEffect(() => {  
        let isMounted = true       

        if (isMounted) {      
            if (token) {
                const AuthString = 'token '.concat(token)

                axios
                .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString } })
                .then(() => {          
                    clearCookies()         
                    dispatch(SignedOut())            //change status of user to sign-out                                   
                })
                .catch ((error) => {   
                    if (error.response) {
                        console.log(error.response.data.message)         
                        clearCookies()             
                    } else {
                        console.log('Error', error.message)
                    }
                })   
            } else {
                clearCookies()         
                dispatch(SignedOut())            //change status of user to sign-out  
            }         
        } 
        return () => { isMounted = false };  //clean up
    }, [token, dispatch]); 

    return  <Redirect to='/' />
}

export default Signout
