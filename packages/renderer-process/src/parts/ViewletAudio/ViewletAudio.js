// based on the audio editor by vscode
import * as ViewletAudioEvents from './ViewletAudioEvents.js'

export const create = () => {
  const $Audio = document.createElement('audio')
  $Audio.controls = true

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
    $AudioErrorMessage: undefined,
  }
}

export const attachEvents = (state) => {
  const { $Audio } = state
  $Audio.onerror = ViewletAudioEvents.handleAudioError
}

export const setSrc = (state, src) => {
  const { $Audio } = state
  $Audio.src = src
}

export const setAudioErrorMessage = (state, audioErrorMessage) => {
  if (!state.$AudioErrorMessage) {
    state.$AudioErrorMessage = document.createElement('div')
    state.$AudioErrorMessage.className = 'AudioErrorMessage'
    state.$Content.append(state.$AudioErrorMessage)
  }
  const { $AudioErrorMessage } = state
  $AudioErrorMessage.textContent = audioErrorMessage
}
