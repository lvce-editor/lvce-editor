export const create = () => {
  const $Audio = document.createElement('audio')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Audio'
  $Viewlet.append($Audio)
  return {
    $Viewlet,
    $Audio,
  }
}

export const setSrc = (state, src) => {
  console.log('set src', src)
  const { $Audio } = state
  $Audio.src = src
}
