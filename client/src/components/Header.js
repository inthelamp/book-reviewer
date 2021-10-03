import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form, FormControl, Button, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import PropTypes from 'prop-types'
import { persistentUser } from '../features/PersistentUser'
import './Header.css'


const Header = ({ title }) => {
    const storeUser = useSelector((state) => state)
    const User = Object.keys(storeUser).length === 0 ? persistentUser() : storeUser

    const getUserName = (user) => {
        let name = '' 

        if (user && user.isSignedIn) {            
            const role = user.role        
            name = user.name
    
            if (role === 'Admin') {
                name = name + ' (' + role + ')'
            }
        }

        return name        
    }    

    // attach Sign Out tab to user name if user name is available
    const userName = useMemo(() => getUserName(User), [User])

    const userTab = userName === '' ? 
                (        
                    <Nav.Link href='/signin'>Sign In</Nav.Link>
                )
                : 
                (
                    <NavDropdown title={userName} id='user-nav-dropdown'>
                        <NavDropdown.Item href='/signout'>
                            Sign Out
                        </NavDropdown.Item>
                    </NavDropdown>
                )     

    // sign out when token is expired            
    const history = useHistory()            

    const signOut = () => {
        history.push('/signout')
    }            

    if (User && User.isTokenExpried) {
        signOut()
    } 
                                  
    return (
        <Navbar bg='white' expand='lg'>            
            <Navbar.Brand 
                    as={Link}  
                    to={{
                        pathname: '/',
                        state: { User }
                    }}
            >
                { title }
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
                <Nav.Link
                    as={Link} 
                    to={{
                        pathname: '/browse',
                        state: { User }
                    }}                
                >
                    Read Reviews
                </Nav.Link>
                <Nav.Link 
                    as={Link} 
                    to={{
                        pathname: '/write',
                        state: { User }
                    }}
                >
                    Write Review
                </Nav.Link>
                <Form className='d-flex'>
                    <FormControl
                        type='search'
                        placeholder='Search'
                        className='mt-0 mb-0 mr-02'
                        aria-label='Search'
                    />
                    <Button variant='success' size='sm'>Search</Button>
                </Form>                  
            </Nav>          
            <Nav className='pull-right user-tab'>
                { userTab }
            </Nav>                 
            </Navbar.Collapse>
        </Navbar>        
    )
}

Header.defaultProps = {
    title: 'Book Reviewer',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header
