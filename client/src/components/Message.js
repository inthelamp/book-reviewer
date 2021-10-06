import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './Message.css'

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