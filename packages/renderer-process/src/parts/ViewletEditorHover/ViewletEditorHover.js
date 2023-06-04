export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorHover'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
}

export const setHover = (state, displayString, documentation) => {
  const { $Viewlet } = state
  const $DisplayString = document.createElement('code')
  $DisplayString.className = 'HoverDisplayString'
  $DisplayString.textContent = displayString
  const $Documentation = document.createElement('div')
  $Documentation.className = 'HoverDocumentation'
  $Documentation.textContent = documentation
  $Viewlet.append($DisplayString, $Documentation)
}
// TODO render dom
