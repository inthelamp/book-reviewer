import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { SignedOut } from '../features/Actions'
import { getToken } from '../features/PersistentUser'

const Signout = () => {    
    const token = getToken()
    
    //Delete cookies
    const clearCookies= () => {
       document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }

    const dispatch = useDispatch()

    useEffect(() => {  
        let isMounted = true       

        if (isMounted && token) {                 
            const AuthString = 'token '.concat(token)

            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString } })
            .then((response) => {          
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
        } 
        return () => { isMounted = false };  //clean up
    }, [token, dispatch]); 

    return  <Redirect to='/' />
}

export default Signout
