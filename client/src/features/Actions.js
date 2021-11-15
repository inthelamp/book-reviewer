import { User, TextEditor, Review } from './ActionTypes'

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

// ChangedModeToInit action
export const ChangedModeToInit = () => ({
    type: TextEditor.CHANGED_MODE_TO_INIT
})

// ChangedModeToBrowse action
export const ChangedModeToBrowse = (review) => ({
    type: TextEditor.CHANGED_MODE_TO_BROWSE,
    payload: {
        review
    }
})

// ChangedModeToEdit action
export const ChangedModeToEdit = (review) => ({
    type: TextEditor.CHANGED_MODE_TO_EDIT,
    payload: {
        review
    }
})

// PostedReview action
export const PostedReview = () => ({
    type: Review.POSTED_REVIEW
})

// ListedReview action
export const ListedReview = () => ({
    type: Review.LISTED_REVIEW
})