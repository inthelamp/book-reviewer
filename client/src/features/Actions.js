import ActionTypes from './ActionTypes'

/**
 * SignedIn action
 * @param {string} name - user name
 * @param {string} role - user role
 */
export const SignedIn = (name, role) => ({
    type: ActionTypes.SIGNED_IN,
    payload: {
        name, 
        role
    }
})

// SignedOut action
export const SignedOut = () => ({
    type: ActionTypes.SIGNED_OUT
})