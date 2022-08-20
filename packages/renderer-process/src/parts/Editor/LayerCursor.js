const create$Cursor = () => {
  const $Cursor = document.createElement('div')
  $Cursor.className = 'EditorCursor'
  return $Cursor
}

const render$Cursor = ($Cursor, cursor) => {
  $Cursor.style.top = `${cursor.top}px`
  $Cursor.style.left = `${cursor.left}px`
}

const render$CursorsLess = ($Cursors, cursors) => {
  for (let i = 0; i < $Cursors.children.length; i++) {
    render$Cursor($Cursors.children[i], cursors[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Cursors.children.length; i < cursors.length; i++) {
    const $Cursor = create$Cursor()
    render$Cursor($Cursor, cursors[i])
    fragment.append($Cursor)
  }
  $Cursors.append(fragment)
}

const render$CursorsEqual = ($Cursors, cursors) => {
  for (let i = 0; i < cursors.length; i++) {
    render$Cursor($Cursors.children[i], cursors[i])
  }
}

const render$CursorsMore = ($Cursors, cursors) => {
  for (let i = 0; i < cursors.length; i++) {
    render$Cursor($Cursors.children[i], cursors[i])
  }
  const diff = $Cursors.children.length - cursors.length
  for (let i = 0; i < diff; i++) {
    $Cursors.lastChild.remove()
  }
}

const render$Cursors = ($Cursors, cursors) => {
  if ($Cursors.children.length < cursors.length) {
    render$CursorsLess($Cursors, cursors)
  } else if ($Cursors.children.length === cursors.length) {
    render$CursorsEqual($Cursors, cursors)
  } else {
    render$CursorsMore($Cursors, cursors)
  }
}

export const setCursors = (state, cursors) => {
  render$Cursors(state.$LayerCursor, cursors)
}
