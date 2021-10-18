import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import UserReducer from './UserReducer'
import TextEditorReducer from './TextEditorReducer'
import ReviewReducer from './ReviewReducer'

// Creating store
const rootReducer = combineReducers({ User: UserReducer, TextEditor: TextEditorReducer, Review: ReviewReducer })
const isInDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? true : false
const composeEnhancers = (isInDevelopment && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||  compose
const Store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(reduxThunk))
)

export default Store