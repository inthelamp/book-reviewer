import { useHistory } from 'react-router-dom'
import RichText from '../components/RichText'
import { Button } from 'react-bootstrap'

const WriteReview = ( props ) => {
    const User =  (props.location && props.location.state.User) || ''
    const content = JSON.parse(localStorage.getItem('content')) || ''
    
    const history = useHistory()    

    const onSave = (e) => {
        e.preventDefault();        

        if (User && User.isSignedIn) {
            console.log('Signed In')
        } else {
            history.push('/signin')
        }        
    }

    return (
        <>
            <RichText />
            <div className='App-Buttons'>
                <br />
                <Button onClick={e => onSave(e)}>Save</Button>               
            </div>
        </>
    )
}

export default WriteReview
