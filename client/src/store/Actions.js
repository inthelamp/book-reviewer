import ActionTypes from './ActionTypes'

export const SignedIn = (id, name, role, token) => ({
    type: ActionTypes.SIGNED_IN,
    payload: {
        id,
        name, 
        role,
        token
    }
})

export const SignedOut = (id) => ({
    type: ActionTypes.SIGNED_OUT,
    payload: {
        id
    }
})