import { Form } from 'react-bootstrap'
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

export default Message