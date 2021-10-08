import { User } from './ActionTypes'

// User reducer
const UserReducer = (state = [], action) => {
    switch(action.type) {
        case User.SIGNED_IN:
            return {
                ...state, 
                id: action.payload.id,
                name: action.payload.name,
                role: action.payload.role,
                isSignedIn: true              
            }
            
        case User.SIGNED_OUT:
            return {
                ...state, 
                id: '',
                name: '',
                role: '',
                isSignedIn: false
            }
                     
        default:
            return state    
    }
}

export default UserReducer
