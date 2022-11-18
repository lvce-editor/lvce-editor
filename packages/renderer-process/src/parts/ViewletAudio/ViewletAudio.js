// based on the audio editor by vscode

export const create = () => {
  const $Audio = document.createElement('audio')
  $Audio.controls = true

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Audio'
  $Viewlet.append($Audio)
  return {
    $Viewlet,
    $Audio,
  }
}

export const setSrc = (state, src) => {
  const { $Audio } = state
  $Audio.src = src
}
