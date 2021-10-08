import { createStore, combineReducers } from 'redux'
import UserReducer from './UserReducer'
import TextEditorReducer from './TextEditorReducer'

// Creating store
const rootReducer = combineReducers({ User: UserReducer, TextEditor: TextEditorReducer})
const Store = createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
)

export default Store