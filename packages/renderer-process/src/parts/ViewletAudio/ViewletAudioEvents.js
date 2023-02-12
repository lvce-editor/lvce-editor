import * as ViewletAudioFunctions from './ViewletAudioFunctions.js'

export const handleAudioError = (event) => {
  const { target } = event
  const { error } = target
  const { code, message } = error
  ViewletAudioFunctions.handleAudioError(code, message)
}
