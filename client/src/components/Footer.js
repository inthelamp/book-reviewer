import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'

const Footer = () => {
    return (
        <footer>
            <p><img className='App-logo' src={logo} alt='Logo' /> &nbsp;Copyright &copy; 2021, IntheLamp &nbsp;
            <Link to='/about'>About</Link>
            </p>
        </footer>
    )
}

export default Footer