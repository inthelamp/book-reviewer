import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import './Footer.css'

const Footer = () => {
    return (
        <footer>
            <p><img src={logo} alt='Logo' /> &nbsp;Copyright &copy; 2021, IntheLamp &nbsp;
            <Link to='/about'>About</Link>
            </p>
        </footer>
    )
}

export default Footer