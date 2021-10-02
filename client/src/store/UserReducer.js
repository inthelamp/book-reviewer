import ActionTypes from './ActionTypes'
import UserStatuses from './UserStatuses'

const UserReducer = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.SIGNED_IN:
            return {
                ...state, 
                id: action.payload.id,
                name: action.payload.name,
                role: action.payload.role,
                token: action.payload.token,
                status: UserStatuses.SIGNED_IN                
            }
            
        case ActionTypes.SIGNED_OUT:
            return state.map(user => user.id !== action.payload.id ? user : {...user, status: UserStatuses.SIGNED_OUT })   
                     
        default:
            return state    
    }
}

export default UserReducer
