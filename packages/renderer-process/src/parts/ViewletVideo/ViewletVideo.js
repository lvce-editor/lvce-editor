// based on the video editor by vscode

import * as ViewletVideoEvents from './ViewletVideoEvents.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as Assert from '../Assert/Assert.js'

export const create = () => {
  const $Video = document.createElement('video')
  $Video.controls = true
  $Video.onerror = ViewletVideoEvents.handleVideoError

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

export const setMediaSourceId = (state, objectId) => {
  Assert.object(state)
  Assert.number(objectId)
  const { $Video } = state
  const handle = Transferrable.get(objectId)
  $Video.srcObject = handle
}

export const setObjectUrl = (state, objectUrl) => {
  const { $Video } = state
  $Video.srcObject = objectUrl
}

export const setAudioErrorMessage = (state, videoErrorMessage) => {
  if (!state.$VideoErrorMessage) {
    state.$VideoErrorMessage = document.createElement('div')
    state.$VideoErrorMessage.className = 'VideoErrorMessage'
    state.$Content.append(state.$VideoErrorMessage)
  }
  const { $VideoErrorMessage } = state
  $VideoErrorMessage.textContent = videoErrorMessage
}
