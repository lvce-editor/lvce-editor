// based on the audio editor by vscode
import * as ViewletAudioEvents from './ViewletAudioEvents.js'

export const create = () => {
  const $Audio = document.createElement('audio')
  $Audio.controls = true
  $Audio.onerror = ViewletAudioEvents.handleAudioError

  const $Content = document.createElement('div')
  $Content.className = 'AudioContent'
  $Content.append($Audio)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Audio'
  $Viewlet.append($Content)
  return {
    $Viewlet,
    $Audio,
    $Content,
  }
}

export const setSrc = (state, src) => {
  const { $Audio } = state
  $Audio.src = src
}

export const setAudioErrorMessage = (state, audioErrorMessage) => {
  const { $Viewlet } = state
  const $Error = document.createElement('div')
  $Error.className = 'ViewletError'
  $Error.textContent = audioErrorMessage
  $Viewlet.replaceChildren($Error)
}
