import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './Message.css'

/**
 * Displaying meesage for the site 
 * @param {string} message - message to be displayed  
 * @param {string} messageStyle - CSS class name to decorate the message
 */
const Message = ({ message, messageStyle }) => {
    return (
          message === '' ?  '' :
                    <>
                        <br />
                        <br />
                        <Form.Label className={messageStyle}>{message}</Form.Label> 
                    </>           
    )
}

Message.propTypes = {
    message: PropTypes.string,
    messageStyle: PropTypes.string
}

export default Message