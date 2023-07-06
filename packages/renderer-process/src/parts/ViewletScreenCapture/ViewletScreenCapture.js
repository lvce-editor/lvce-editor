export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ScreenCapture'
  return {
    $Viewlet,
  }
}

export const setMessage = (state, message) => {
  const { $Viewlet } = state
  $Viewlet.textContent = message
}
