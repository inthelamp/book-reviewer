import { useState, useCallback, useEffect, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import {  createEditor } from 'slate'
import PropTypes from 'prop-types'
import { withHistory } from 'slate-history'
import './ReadOnlyText.css'

/**
 * Displaying read only editor
 * @param {array} content, a JSON string 
 */
const ReadOnlyText = ({ content }) => {
    const [value, setValue] = useState(InitialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    useEffect(() => {
        setValue(JSON.parse(content) )
    }, [content])

    return (    
        <div className='browser'>      
            <Slate editor={editor} value={value} onChange={value => setValue(value)}>
            <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Read a book review..."
            spellCheck
            autoFocus
            />
            </Slate>    
        </div>
    )
}


/* eslint-disable react/prop-types */
const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>         
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}


const InitialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
]

ReadOnlyText.propTypes = {
    content: PropTypes.array.isRequired
}
  
  
export default ReadOnlyText