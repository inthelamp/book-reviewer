import { TextEditor } from './ActionTypes'

// TextEditor reducer
const TextEditorReducer = (state = [], action) => {
    switch(action.type) {
        case TextEditor.CHANGED_MODE_TO_INIT:
            return {
                ...state, 
                mode: TextEditor.CHANGED_MODE_TO_INIT,           
            }        
            
        case TextEditor.CHANGED_MODE_TO_BROWSE:
            return {
                ...state, 
                review: action.payload.review,   
                mode: TextEditor.CHANGED_MODE_TO_BROWSE,           
            }
            
        case TextEditor.CHANGED_MODE_TO_EDIT:
            return {
                ...state, 
                review: action.payload.review,                
                mode: TextEditor.CHANGED_MODE_TO_EDIT
            }
            
        default:
            return state    
    }
}

export default TextEditorReducer
