import { Alert } from 'react-bootstrap'


const WriteReview = ( props ) => {
    const User =  (props.location && props.location.state.User) || ''
    const getUserName = () => {
        console.log('User', User)

        if (User) {
            return User.name
        }

        return ''
    }

    return (
        <Alert variant='info'>
            {getUserName()}
        </Alert>    
    )
}

export default WriteReview
