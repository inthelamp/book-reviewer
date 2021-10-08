import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import ReviewEditor from './ReviewEditor'
import Reviews from './Reviews'

/**
 * Home page of the site
 */
const Home = ( props ) => {
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
                <Col><ReviewEditor userId={User.id} isSignedIn={ isSignedIn }/></Col>
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
