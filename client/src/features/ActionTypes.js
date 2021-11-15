/**
 * Action types
 * @enum {string}
 */
export const User = {
	SIGNED_IN: 'signedIn',
	SIGNED_OUT: 'signedOut'
}

export const TextEditor = {
	CHANGED_MODE_TO_INIT: 'changedModeToInit',		
	CHANGED_MODE_TO_BROWSE: 'changedModeToBrowse',
	CHANGED_MODE_TO_EDIT: 'changedModeToEdit'
}

export const Review = {
	POSTED_REVIEW: 'postedReview',
	LISTED_REVIEW: 'listedReview'
}