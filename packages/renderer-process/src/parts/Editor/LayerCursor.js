import * as Assert from '../Assert/Assert.js'

const create$Cursor = () => {
  const $Cursor = document.createElement('div')
  $Cursor.className = 'EditorCursor'
  return $Cursor
}

const render$Cursor = ($Cursor, cursors, i) => {
  const top = cursors[i]
  const left = cursors[i + 1]
  $Cursor.style.top = `${top}px`
  $Cursor.style.left = `${left}px`
}

const render$CursorsLess = ($Cursors, childCount, cursors, cursorCount) => {
  for (let i = 0, j = 0; i < childCount; i++, j += 2) {
    render$Cursor($Cursors.children[i], cursors, j)
  }
  const fragment = document.createDocumentFragment()
  for (let i = childCount; i < cursorCount; i++) {
    const $Cursor = create$Cursor()
    render$Cursor($Cursor, cursors, i)
    fragment.append($Cursor)
  }
  $Cursors.append(fragment)
}

const render$CursorsEqual = ($Cursors, childCount, cursors, cursorCount) => {
  for (let i = 0; i < cursorCount; i++) {
    render$Cursor($Cursors.children[i], cursors, i)
  }
}

const render$CursorsMore = ($Cursors, childCount, cursors, cursorCount) => {
  for (let i = 0; i < cursorCount; i++) {
    render$Cursor($Cursors.children[i], cursors, i)
  }
  const diff = childCount - cursorCount
  for (let i = 0; i < diff; i++) {
    $Cursors.lastChild.remove()
  }
}

const render$Cursors = ($Cursors, cursors) => {
  const cursorCount = cursors.length / 2
  const childCount = $Cursors.children.length
  if (childCount < cursorCount) {
    render$CursorsLess($Cursors, childCount, cursors, cursorCount)
  } else if (childCount === cursorCount) {
    render$CursorsEqual($Cursors, childCount, cursors, cursorCount)
  } else {
    render$CursorsMore($Cursors, childCount, cursors, cursorCount)
  }
}

const renderCursorsNative = (state, cursors) => {
  if (cursors.length > 1) {
    console.warn('[editor] cannot render more than one native cursor')
    return
  }
  if (cursors.length === 0) {
    return
  }
  const cursor = cursors[0]
  const $Rows = state.$LayerText
  const $StartRow = $Rows.children[cursor.rowIndex]
  let startOffset = 0
  let $Anchor
  for (let i = 0; i < $StartRow.children.length; i++) {
    if (startOffset >= cursor.columnIndex) {
      $Anchor = $StartRow.children[i - 1].firstChild
      startOffset -= $Anchor.textContent.length
      startOffset = cursor.columnIndex - startOffset
      break
    }
    startOffset += $StartRow.children[i].textContent.length
  }
  if (!$Anchor) {
    $Anchor = $StartRow.children[$StartRow.children.length - 1].firstChild
    startOffset -= $Anchor.textContent.length
    startOffset = cursor.columnIndex - startOffset
  }
  const selection = document.getSelection()
  if (
    selection.anchorNode === $Anchor &&
    selection.focusNode === $Anchor &&
    selection.anchorOffset === startOffset &&
    selection.focusOffset === startOffset
  ) {
    return
  }
  state.shouldIgnoreSelectionChange = true
  const documentRange = document.createRange()
  documentRange.setStart($Anchor, startOffset)
  documentRange.setEnd($Anchor, startOffset)
  selection.removeAllRanges()
  selection.addRange(documentRange)
}

export const setCursors = (state, cursors) => {
  Assert.array(cursors)
  render$Cursors(state.$LayerCursor, cursors)
}
