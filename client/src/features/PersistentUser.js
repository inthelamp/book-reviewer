import jwt_decode from 'jwt-decode'

export const getToken = () => {
    const name = 'token='
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

export const getTokenNotExpried = () => {
    const token = getToken()

    if (token) {      
        try {
            const decoded = jwt_decode(token)     
            const { exp } = decoded

            if (Date.now() < exp * 1000) { 
                return token
            } 
        } catch (error) {
            console.log(error)
        }
    }   

    return ''
}

export const persistentUser = () => {
    const token = getToken()

    if (token) {      
        try {
            const decoded = jwt_decode(token)     
            const { name, role, exp } = decoded

            if (Date.now() < exp * 1000) { 
                return {
                    name,
                    role,
                    "isSignedIn": true
                }
            } else {
                return {
                    "isTokenExpired": true
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return null
}