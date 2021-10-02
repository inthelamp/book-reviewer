import { useState, useEffect } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

const Signout = () => {    
    const [isSignedOut, setIsSignedOut] = useState(false)

    const getCookie = (cookieName) => {
        let name = cookieName + '='
        let decodedCookie = decodeURIComponent(document.cookie)
        let cookieAttributes = decodedCookie.split(';')
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

    const clearCookies = () => {
       let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
       document.cookie = 'token=; expires=' + yesterday.toUTCString
       window.location.reload()       
    }

    useEffect(() => {
        if (!isSignedOut) {
            const token = getCookie('token')

            if (token) {
                console.log(token)
    
                const AuthString = 'token '.concat(token)
    
                axios
                .get(process.env.REACT_APP_SERVER_BASE_URL + '/users/signout', { headers: { Authorization: AuthString } })
                .then((response) => {          
                    setIsSignedOut(true)      
                    clearCookies()                                       
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
        }
    }, [isSignedOut]); 

    return <Redirect to='/' />
}

export default Signout
