export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorHover'
  $Viewlet.textContent = 'hover'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
}

// TODO render dom
