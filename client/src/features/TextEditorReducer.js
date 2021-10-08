import { TextEditor} from './ActionTypes'

// TextEditor reducer
const TextEditorReducer = (state = [], action) => {
    switch(action.type) {
        case TextEditor.CHANGED_MODE_TO_BROWSE:
            return {
                ...state, 
                mode: 'browse',           
            }
            
        case TextEditor.CHANGED_MODE_TO_EDIT:
            return {
                ...state, 
                mode: 'edit'
            }
                     
        default:
            return state    
    }
}

export default TextEditorReducer
