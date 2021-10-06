import { createStore } from 'redux'
import UserReducer from './UserReducer'

// Creating store
const Store = createStore(UserReducer)

export default Store