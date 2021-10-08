import { User, TextEditor } from './ActionTypes'

/**
 * SignedIn action
 * @param {string} id - user id
 * @param {string} name - user name
 * @param {string} role - user role
 */
export const SignedIn = (id, name, role) => ({
    type: User.SIGNED_IN,
    payload: {
        id,
        name, 
        role
    }
})

// SignedOut action
export const SignedOut = () => ({
    type: User.SIGNED_OUT
})

// ChangedModeToBrowse action
export const ChangedModeToBrowse = () => ({
    type: TextEditor.CHANGED_MODE_TO_BROWSE
})

// ChangedModeToEdit action
export const ChangedModeToEdit = () => ({
    type: TextEditor.CHANGED_MODE_TO_EDIT
})