import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { SignedOut } from '../store/Actions'

const Signout = ( props ) => {    
    const [isSignedOut, setIsSignedOut] = useState(false)
    // const User =  (props.location && props.location.state.User) || ''
    const cookieName = 'token'

    const getCookie = (cookieName) => {
        const name = cookieName + '='
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookieAttributes = decodedCookie.split(';')

        for(let i = 0; i <cookieAttributes.length; i++) {
            let ca = cookieAttributes[i]
            while (ca.charAt(0) === ' ') {
                ca = ca.substring(1)
            }
            if (ca.indexOf(name) === 0) {
                return ca.substring(name.length, ca.length)
            }
        }
        return ''
    }

    const token = useMemo(() => getCookie(cookieName), [cookieName])
    
    const clearCookies= () => {
       const yesterday = new Date(new Date().setDate(new Date().getDate()-1));
       document.cookie = 'token=; expires=' + yesterday.toUTCString  
    }

    const dispatch = useDispatch()

    useEffect(() => {  
        if (!isSignedOut && token) {                 
            const AuthString = 'token '.concat(token)

            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString } })
            .then((response) => {          
                clearCookies()     
                setIsSignedOut(true)                                            
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
    }, [isSignedOut, token]); 

    useEffect(() => {  
        if (isSignedOut) {                 
            try {
                dispatch(SignedOut()) 
                return <Redirect to='/' />
            } catch (error) {
                console.log(error)
            }
        }
    }, [isSignedOut, dispatch]); 

    return <></>
}

export default Signout