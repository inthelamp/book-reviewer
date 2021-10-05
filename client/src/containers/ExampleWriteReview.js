import { useMemo, useState, useCallback } from 'react'
import { createEditor, Editor, Transforms, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
// import { Alert } from 'react-bootstrap'


const CustomEditor = {
    isBoldMarkActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.bold === true,
        universal: true,
      })
  
      return !!match
    },
  
    isCodeBlockActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'code',
      })
  
      return !!match
    },
  
    toggleBoldMark(editor) {
      const isActive = CustomEditor.isBoldMarkActive(editor)
      Transforms.setNodes(
        editor,
        { bold: isActive ? null : true },
        { match: n => Text.isText(n), split: true }
      )
    },
  
    toggleCodeBlock(editor) {
      const isActive = CustomEditor.isCodeBlockActive(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'code' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },
}

const WriteReview = ( props ) => {
    // const User =  (props.location && props.location.state.User) || ''
    // const getUserName = () => {
    //     console.log('User', User)

    //     if (User) {
    //         return User.name
    //     }

    //     return ''
    // }

    
    const editor = useMemo(() => withReact(createEditor()), [])
    const [value, setValue] = useState([
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ])

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])  

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])  

    return (
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <div>
            <button
            onMouseDown={event => {
                event.preventDefault()
                CustomEditor.toggleBoldMark(editor)
            }}
            >
            Bold
            </button>
            <button
            onMouseDown={event => {
                event.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
            }}
            >
            Code Block
            </button>
        </div> 
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}

          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }
  
            switch (event.key) {
                case '`': {
                  event.preventDefault()
                  CustomEditor.toggleCodeBlock(editor)
                  break
                }
    
                case 'b': {
                  event.preventDefault()
                  CustomEditor.toggleBoldMark(editor)
                  break
                }
            }
          }}
        />
      </Slate>
    )
}


const CodeElement = ( props ) => {
    return (
        <pre {...props.attributes}>
        <code>{props.children}</code>
        </pre>
    )
}     

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

const Leaf = props => {
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
      >
        {props.children}
      </span>
    )
}

export default WriteReview