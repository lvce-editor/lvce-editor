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

const setContent = ($Content, content) => {
  $Content.textContent = content
}

export const setContentLeft = (state, content) => {
  const { $ContentLeft } = state
  setContent($ContentLeft, content)
}

export const setContentRight = (state, content) => {
  const { $ContentRight } = state
  setContent($ContentRight, content)
}
