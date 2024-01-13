import * as Hover from '../Hover/Hover.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorPosition from './EditorCommandPosition.js'

const getHover = async (editor, rowIndex, columnIndex) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const hover = await Hover.getHover(editor, offset)
  return hover
}

const showHover = async (editor, position) => {
  const hover = await getHover(editor, position.rowIndex, position.columnIndex)
  if (!hover) {
    console.log('no hover')
    return
  }

  RendererProcess.invoke(
    /* EditorHover.show */ 6216,
    /* x */ editor.left + position.columnIndex * editor.columnWidth,
    /* y */ editor.top + position.rowIndex * editor.rowHeight,
    /* hover */ hover,
  )
  console.log({ hover })
}

const hoverState = {
  timeout: -1,
  x: 0,
  y: 0,
}

// TODO several things can happen:
// 1. highlight link when alt key is pressed
// 2. show hover info
// 3. selection moves
const onHoverIdle = () => {
  // console.log('hover idle')
  // const { x, y, editor } = hoverState
  // console.log({ x, y })
  // const position = EditorPosition.at(editor, x, y)
  // console.log({ position })
  // showHover(editor, position)
}

export const handleMouseMove = (editor, x, y) => {
  if (hoverState.timeout !== -1) {
    clearTimeout(hoverState.timeout)
  }
  // @ts-ignore
  hoverState.timeout = setTimeout(onHoverIdle, 1000)
  hoverState.x = x
  hoverState.y = y
  // hoverState.editor = editor
  return editor
}
