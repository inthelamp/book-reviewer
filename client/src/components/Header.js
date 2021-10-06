import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { persistentUser } from '../features/PersistentUser'
import UserRoles from './UserRoles'
import './Header.css'
import logo from '../assets/images/logo.png'

/**
 * A header containing navigation bar
 */
const Header = () => {
    const title = process.env.REACT_APP_TITLE
    const storeUser = useSelector((state) => state)
    const User = Object.keys(storeUser).length === 0 ? persistentUser() : storeUser


    /**
     * Getting a user name
     * @param {object} user - an object containing name, role, and isSignedIn
     * @returns {string} user name and its role is attached to the user name if the user has the admin role
     */
    const getUserName = (user) => {
        let name = '' 

        if (user && user.isSignedIn) {            
            const role = user.role        
            name = user.name
    
            if (role === UserRoles.ADMIN) {
                name = name + ' (' + role + ')'
            }
        }

        return name        
    }    

    const userName = useMemo(() => getUserName(User), [User])

    // Attach Sign Out tab to user name if user name is available
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
       
    const history = useHistory()            

    // Goto sign-out page when token is expired       
    const signOut = () => {
        history.push('/signout')
    }            

    if (User && User.isTokenExpired) {
        signOut()
    } 
                                  
    return (
        <header>
            <Navbar bg='white' expand='lg'>      
                <img className='App-logo' src={logo} alt='Logo' />      
                <Navbar.Brand 
                        as={Link}  
                        to={{
                            pathname: '/',
                            state: { User }
                        }}
                >
                    { title }
                </Navbar.Brand>          
                <Navbar.Collapse id='basic-navbar-nav'>     
                    <Nav className='me-auto'>
                    </Nav>    
                    <Nav className='pull-right user-tab'>
                        { userTab }
                    </Nav>                 
                </Navbar.Collapse>
            </Navbar>        
        </header>    
    )
}

export default Header
