export const create = () => {
  const $ContentLeft = document.createElement('div')
  $ContentLeft.className = 'DiffEditorContentLeft'
  const $ContentRight = document.createElement('div')
  $ContentRight.className = 'DiffEditorContentRight'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DiffEditor'
  $Viewlet.append($ContentLeft, $ContentRight)

  return {
    $Viewlet,
    $ContentLeft,
    $ContentRight,
  }
}

const create$Line = (line) => {
  const $Line = document.createElement('div')
  $Line.textContent = line
  return $Line
}

const setContent = ($Content, lines) => {
  $Content.replaceChildren(...lines.map(create$Line))
}

export const setContentLeft = (state, lines) => {
  const { $ContentLeft } = state
  setContent($ContentLeft, lines)
}

export const setContentRight = (state, lines) => {
  const { $ContentRight } = state
  setContent($ContentRight, lines)
}

export const setChanges = (state, changes) => {
  const { $ContentLeft, $ContentRight } = state
  const { changesLeft, changesRight } = changes
  for (const change of changesLeft) {
    if (change.type === 'delete') {
      $ContentLeft.children[change.index].style.background = 'red'
    }
  }
  for (const change of changesRight) {
    if (change.type === 'insert') {
      $ContentRight.children[change.index].style.background = 'green'
    }
  }
}
