import ActionTypes from './ActionTypes'

// User reducer
const UserReducer = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.SIGNED_IN:
            return {
                ...state, 
                name: action.payload.name,
                role: action.payload.role,
                isSignedIn: true              
            }
            
        case ActionTypes.SIGNED_OUT:
            return {
                ...state, 
                name: '',
                role: '',
                isSignedIn: false
            }
                     
        default:
            return state    
    }
}

export default UserReducer
