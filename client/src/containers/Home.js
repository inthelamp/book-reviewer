import { useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import { persistentUser } from '../features/PersistentUser'
import ReviewEditor from './ReviewEditor'
import ReviewDetail from '../components/ReviewDetail'
import Reviews from './Reviews'
import { TextEditor } from '../features/ActionTypes'

/**
 * Home page of the site
 */
const Home = () => {
    // Redux selector for TextEditor
    const TextEditorStore = useSelector((state) => state.TextEditor)

     // Redux selector for User
    const UserStore = useSelector((state) => state.User)
    
    /**
     * @typedef {Object} User
     * @property {string} id - User id
     * @property {string} name - User name
     * @property {string} role - User role
     * @property {bool} isSignedIn - presenting if user is signed in or not
     */  
    const User = Object.keys(UserStore).length === 0 ? persistentUser() : UserStore
    const isSignedIn = User ? User.isSignedIn : false

    return (
        <Container>
            <Row>
                <Col><Reviews userId={User.id} isSignedIn={ isSignedIn } /></Col>
                { Object.keys(TextEditorStore).length !== 0 && TextEditorStore.mode === TextEditor.CHANGED_MODE_TO_BROWSE ?
                    (<Col><ReviewDetail userId={User.id} isSignedIn={ isSignedIn } review={TextEditorStore.review} /></Col>)
                    :
                    (<Col><ReviewEditor userId={User.id} isSignedIn={ isSignedIn }/></Col>)
                }
            </Row>
        </Container>
    )
}

export default Home
