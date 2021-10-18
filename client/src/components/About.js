import { Link } from 'react-router-dom'

/**
 * 
 * Presenting information about this site
 */
const About = () => {
    return (
        <div>
            <h4>Version 0.1.0</h4>
            <h4>License: <a href='https://opensource.org/licenses/MIT' target='_blank' rel='noreferrer'>MIT</a></h4>
            <h4>Contributor: <a href='https://github.com/inthelamp' target='_blank' rel='noreferrer'>IntheLamp</a></h4>
            <Link to='/'>Go Back</Link>
        </div>
    )
}

export default About
