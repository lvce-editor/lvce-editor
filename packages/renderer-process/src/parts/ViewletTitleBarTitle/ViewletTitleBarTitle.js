export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet TitleBarTitle'
  return {
    $Viewlet,
  }
}

export const setTitle = (state, title) => {
  const { $Viewlet } = state
  $Viewlet.textContent = title
}
