// based on the video editor by vscode

import * as ViewletVideoEvents from './ViewletVideoEvents.js'

export const create = () => {
  const $Video = document.createElement('video')
  $Video.className = 'VideoVideo'
  $Video.controls = true

  const $Content = document.createElement('div')
  $Content.className = 'VideoContent'
  $Content.append($Video)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Video'
  $Viewlet.append($Content)
  return {
    $Viewlet,
    $Video,
    $Content,
    $VideoErrorMessage: undefined,
  }
}

export const attachEvents = (state) => {
  const { $Video } = state
  $Video.onerror = ViewletVideoEvents.handleVideoError
}

export const setSrc = (state, src) => {
  const { $Video } = state
  $Video.src = src
}

export const setVideoErrorMessage = (state, videoErrorMessage) => {
  if (!state.$VideoErrorMessage) {
    state.$VideoErrorMessage = document.createElement('div')
    state.$VideoErrorMessage.className = 'VideoErrorMessage'
    state.$Content.append(state.$VideoErrorMessage)
  }
  const { $VideoErrorMessage } = state
  $VideoErrorMessage.textContent = videoErrorMessage
}
