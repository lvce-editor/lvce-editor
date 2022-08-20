const create$Cursor = () => {
  const $Cursor = document.createElement('div')
  $Cursor.className = 'EditorCursor'
  return $Cursor
}

const render$Cursor = ($Cursor, cursors, i) => {
  const top = cursors[i * 2]
  const left = cursors[i * 2 + 1]
  $Cursor.style.top = `${top}px`
  $Cursor.style.top = `${left}px`
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

export const setCursorsFaster = (state, cursors) => {
  render$Cursors(state.$LayerCursor, state.$LayerText, cursors)
}
