import { createStore } from 'redux'
import UserReducer from './UserReducer'


//const rootReducer = combineReducers({User: UserReducer})
const Store = createStore(UserReducer)

export default Store