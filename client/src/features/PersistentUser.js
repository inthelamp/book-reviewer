import jwt_decode from 'jwt-decode'

/**
 * Getting a token from cookie
 * @returns {string} return token
 */
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

/**
 * Getting a token not expired from cookie
 * @returns {string} return token
 */
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

/**
 * Extracting user information from token
 * @returns {object} return user information, but return null if token is not available and retun isTokenExpired if token is expired
 */
export const persistentUser = () => {
    const token = getToken()

    if (token) {      
        try {
            const decoded = jwt_decode(token)     
            const { id, name, role, exp } = decoded

            if (Date.now() < exp * 1000) { 
                return {
                    id,
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