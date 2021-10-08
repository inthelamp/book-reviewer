
import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import './ReadOnlyText.css'

const ReadOnlyText = ( { content } ) => {
  const initialValue = JSON.parse(content) 

  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <div className='browser'>
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Editable readOnly placeholder="Enter some plain text..." />
      </Slate>
    </div>
  )
}

ReadOnlyText.propTypes = {
  content: PropTypes.string.isRequired
}


export default ReadOnlyText