import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { Button, Navbar, Container } from 'react-bootstrap'
import { 
    TypeBold,
    TypeItalic,
    TypeUnderline,
    Code,
    TypeH1,
    TypeH2,
    TypeH3,
    ChatQuote,
    ListOl,
    CardList
} from 'react-bootstrap-icons'
import './RichText.css'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const RichText = () => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem('content')) || initialValue
  )
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const onChange = (value) => {
    setValue(value)

    const isChanged = editor.operations.some((op) => 'set_selection' !== op.type)
    if (isChanged) {
      const content = JSON.stringify(value)
      localStorage.setItem('content', content)
    }
  }

  return (
    <div className='editor'>
      <Slate editor={editor} value={value} onChange={value => onChange(value)}>
        <Navbar bg="light" expand='sm'>
          <Container>
            <MarkButton format="bold" icon={ <TypeBold /> } />
            <MarkButton format="italic" icon={ <TypeItalic />} />
            <MarkButton format="underline" icon={ <TypeUnderline /> } />
            <MarkButton format="code" icon={ <Code />} />
            <BlockButton format="heading-one" icon={ <TypeH1 /> } />
            <BlockButton format="heading-two" icon={ <TypeH2 /> } />
            <BlockButton format="heading-three" icon={ <TypeH3  /> } />        
            <BlockButton format="block-quote" icon={ <ChatQuote /> } />
            <BlockButton format="numbered-list" icon={ <ListOl /> } />
            <BlockButton format="bulleted-list" icon={ <CardList /> } />
          </Container>
        </Navbar>
        <br />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Write a book review here..."
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

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

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button variant='outline-secondary'
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      { icon }
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button variant='outline-secondary'
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      { icon }
    </Button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export default RichText