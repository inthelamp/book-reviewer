import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import ReviewEditor from './ReviewEditor'
import ReviewDetail from '../components/ReviewDetail'
import Reviews from './Reviews'
import { TextEditor } from '../features/ActionTypes'

/**
 * Home page of the site
 */
const Home = ( props ) => {
    // Redux selector for TextEditor mode
    const TextEditorStore = useSelector((state) => state.TextEditor)

    /**
     * @typedef {Object} User
     * @property {string} id - User id
     * @property {string} name - User name
     * @property {string} role - User role
     * @property {bool} isSignedIn - presenting if user is signed in or not
     */  
    const User =  (props.location && props.location.state && props.location.state.User) || ''
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

Home.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            User: PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                role: PropTypes.string,
                isSignedIn: PropTypes.bool.isRequired,
            })
        })
    })
}

export default Home
