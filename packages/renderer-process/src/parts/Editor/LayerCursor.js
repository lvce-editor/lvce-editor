const create$Cursor = () => {
  const $Cursor = document.createElement('div')
  $Cursor.className = 'EditorCursor'
  return $Cursor
}

const render$Cursor = ($Cursor, $Texts, cursor) => {
  $Cursor.style.top = `${cursor.top}px`
  const range = document.createRange()
  if (cursor.leftIndex === -1) {
    console.warn('cursor left is negative')
    $Cursor.style.left = '0px' // TODO need to compute column width, this would only work for monospace fonts
    return
  }
  const $Row = $Texts.children[cursor.topIndex]
  if (!$Row) {
    console.warn('no row', cursor, $Row)
    return
  }
  const $Node = $Row.children[cursor.leftIndex]
  if (!$Node) {
    console.warn('no node', cursor, $Row)
    return
  }
  if (cursor.leftIndex === 0 && cursor.remainingOffset === 0) {
    $Cursor.style.left = '0px'
  } else {
    const $TextNode = $Node.firstChild
    range.setStart($TextNode, cursor.remainingOffset)
    range.setEnd($TextNode, cursor.remainingOffset)
    const rect = range.getBoundingClientRect()
    const left = Math.round(rect.left)
    $Cursor.style.left = `${left}px`
  }
}

const render$CursorsLess = ($Cursors, $Texts, cursors) => {
  for (let i = 0; i < $Cursors.children.length; i++) {
    render$Cursor($Cursors.children[i], $Texts, cursors[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Cursors.children.length; i < cursors.length; i++) {
    const $Cursor = create$Cursor()
    render$Cursor($Cursor, $Texts, cursors[i])
    fragment.append($Cursor)
  }
  $Cursors.append(fragment)
}

const render$CursorsEqual = ($Cursors, $Texts, cursors) => {
  for (let i = 0; i < cursors.length; i++) {
    render$Cursor($Cursors.children[i], $Texts, cursors[i])
  }
}

const render$CursorsMore = ($Cursors, $Texts, cursors) => {
  for (let i = 0; i < cursors.length; i++) {
    render$Cursor($Cursors.children[i], $Texts, cursors[i])
  }
  const diff = $Cursors.children.length - cursors.length
  for (let i = 0; i < diff; i++) {
    $Cursors.lastChild.remove()
  }
}

const render$Cursors = ($Cursors, $Texts, cursors) => {
  if ($Cursors.children.length < cursors.length) {
    render$CursorsLess($Cursors, $Texts, cursors)
  } else if ($Cursors.children.length === cursors.length) {
    render$CursorsEqual($Cursors, $Texts, cursors)
  } else {
    render$CursorsMore($Cursors, $Texts, cursors)
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
      console.log({ startOffset })
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
  render$Cursors(state.$LayerCursor, state.$LayerText, cursors)
}
