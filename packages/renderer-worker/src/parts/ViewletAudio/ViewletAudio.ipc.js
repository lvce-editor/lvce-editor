import * as ViewletAudio from './ViewletAudio.js'

export const name = 'Audio'

export const Commands = {
  handleAudioError: ViewletAudio.handleAudioError,
}

export const Css = ['/css/parts/ViewletAudio.css']

export * from './ViewletAudio.js'
