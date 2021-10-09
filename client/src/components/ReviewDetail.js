import { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Container, ButtonGroup, Row, Col, Form, Button } from 'react-bootstrap'
import ReadOnlyText from './ReadOnlyText'
import Message from '../components/Message'

/**
 * @typedef {Object} Review
 * @property {string} reviewId - Review id
 * @property {subject} subject - Review subject
 * @property {bool} isOwner - presenting if the user is the owner of the review or not
 * @property {string} status - Review status
 */ 
/**
 * Displaying review content and updating review information
 * @param {string} userId - User id
 * @param {bool} isSignedIn - Presenting if the user is signed in or not
 * @param {Review} review - Review object
 */
const ReviewDetail = ( { userId, isSignedIn, review } ) => { 
    const [detail, setDetail] = useState()
    const [subject, setSubject] = useState('')
    const [bookTitle, setBookTitle] = useState('')
    const [isbn, setISBN] = useState('')
    const [authors, setAuthors] = useState({
            firstAuthor: '',
            secondAuthor: '',
            thirdAuthor: ''
    }) 
    const [message, setMessage] = useState('')
    const [messageStyle, setMessageStyle] = useState('')

    // Getting a review  
    useEffect(() => {  
        if (review.reviewId) {
            // Sending server a request to get others' reviews
            axios
            .get(process.env.REACT_APP_SERVER_BASE_URL + '/reviews/reviews/' + review.reviewId)
            .then((response) => {    
                setDetail(response.data.detail)         
                console.log(response.data.message)                  
            })
            .catch ((error) => {   
                if (error.response) {
                    console.log(error.response.data.message)              
                } else {
                    console.log('Error', error.message)
                }
            })   
        }
    }, [review.reviewId]); 

    const containerStyle = {
        paddingLeft: 0,
        paddingRight: 0,
    }

    const updateAuthor = (e) => {     
        e.preventDefault()
        
        setAuthors({
            ...authors,
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        setMessage('Hi, it needs further development!')
        setMessageStyle('success-message')       
        alert('Hi, it needs further development!');
    }

    const onEditThisReview = (e) => {
        e.preventDefault()

        setMessage('Hi, it needs further development!')
        setMessageStyle('success-message')       
        alert('Hi, it needs further development!');
    }

    const onMakeNewPost = (e) => {
        e.preventDefault()

        setMessage('Hi, it needs further development!')
        setMessageStyle('success-message')       
        alert('Hi, it needs further development!');
        console.log(userId)
    }

    return (
        <>
             <ButtonGroup className='mb-1 float-sm-end'>
                { isSignedIn ?  
                    //  Displaying this edit button if the user is signed in
                    <Button variant='secondary' onClick={onEditThisReview} >Edit this review</Button>   
                    : null 
                }
                <Button variant='secondary' onClick={onMakeNewPost}>Post new review</Button>
            </ButtonGroup>    

            {detail ? <ReadOnlyText content={detail.content} /> : null }

            {/* Allowed for reviews posted by the use signed in */}
            {review.isOwner ? 
                <Form className='mt-2' onSubmit={onSubmit}>    
                    <Form.Group className='mb-3' size='lg' controlId='subject'>
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                        type='text'
                        value={subject}
                        onChange={(e) => setSubject(e.currentTarget.value)}
                        />      
                    </Form.Group>
                    <Form.Group className='mb-3' size='lg' controlId='bookTitle'>
                    <Container style={containerStyle}> 
                        <Row>
                            <Col xs={10}>
                                <Form.Label>Book Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={bookTitle}
                                    onChange={(e) => setBookTitle(e.currentTarget.value)}
                                />     
                            </Col>
                            <Col xs={2}>
                                <Form.Label>Book ISBN-13</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={isbn}
                                    onChange={(e) => setISBN(e.currentTarget.value)}    
                                />    
                            </Col>
                        </Row>
                    </Container>    
                    </Form.Group>          
                    <Form.Group className='mb-3' size='lg' controlId='authors'>
                    <Container style={containerStyle}>
                        <Row>
                            <Col>
                                <Form.Label>First Author</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='firstAuthor'
                                    value={authors.firstAuthor}
                                    onChange={updateAuthor}
                                />     
                            </Col>
                            <Col>
                                <Form.Label>Second Author</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='secondAuthor'                               
                                    value={authors.secondAuthor}
                                    onChange={updateAuthor}
                                />    
                            </Col>
                            <Col>
                                <Form.Label>Third Author</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='thirdAuthor'                                     
                                    value={authors.thirdAuthor}
                                    onChange={updateAuthor}
                                />    
                            </Col>
                        </Row>
                    </Container>
                    </Form.Group>                    
                    <div className='App-Buttons'>
                        <Button size='lg' type='submit'>Update</Button>     
                        <Message message={message} messageStyle={messageStyle}/>                         
                    </div>      
                </Form>   
                :
                null 
            }
        </>
    )
}

ReviewDetail.propTypes = {
    userId: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired,
    review: PropTypes.shape({
        reviewId: PropTypes.string,
        subject: PropTypes.string,
        isOwner: PropTypes.bool,
        status: PropTypes.string        
    })
}

export default ReviewDetail
