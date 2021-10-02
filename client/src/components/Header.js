import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form, FormControl, Button, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import PropTypes from 'prop-types'
import './Header.css'


const Header = ({ title }) => {
    const User = useSelector((state) => state)
 
    const getUserName = () => {
        let name = ''        

        if (User && User.isSignedIn) {            
            const role = User.role        
            name = User.name
    
            if (role === 'Admin') {
                name = name + ' (' + role + ')'
            }
        }

        return name
    }    

    const userTab = () => {
        const userName = getUserName()

        return (
            userName === '' ? 
                (
                    <Nav.Link href='/signin'>Sign In</Nav.Link>
                ) 
                : 
                (
                    <NavDropdown title={userName} id='user-nav-dropdown'>
                        <NavDropdown.Item 
                            as={Link}
                            to={{
                                pathname:'/signout',
                                state: { User }
                            }}
                        >
                            Sign Out
                        </NavDropdown.Item>
                    </NavDropdown>
                )
        )
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
                { userTab() }
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
