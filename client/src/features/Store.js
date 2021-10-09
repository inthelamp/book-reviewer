import { createStore, combineReducers } from 'redux'
import UserReducer from './UserReducer'
import TextEditorReducer from './TextEditorReducer'
import ReviewReducer from './ReviewReducer'

// Creating store
const rootReducer = combineReducers({ User: UserReducer, TextEditor: TextEditorReducer, Review: ReviewReducer })
const Store = createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //Enabling Redux DeveTools 
)

export default Store