import ActionTypes from './ActionTypes'

export const SignedIn = (name, role) => ({
    type: ActionTypes.SIGNED_IN,
    payload: {
        name, 
        role
    }
})

export const SignedOut = () => ({
    type: ActionTypes.SIGNED_OUT
})