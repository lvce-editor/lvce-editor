import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ViewletAudioFunctions from './ViewletAudioFunctions.ts'

export const handleAudioError = (event) => {
  const { target } = event
  const { error } = target
  const { code, message } = error
  const uid = ComponentUid.fromEvent(event)
  ViewletAudioFunctions.handleAudioError(uid, code, message)
}
