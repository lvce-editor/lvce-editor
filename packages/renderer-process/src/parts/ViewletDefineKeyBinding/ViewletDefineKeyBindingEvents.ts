import * as Event from '../Event/Event.ts'
import * as ViewletDefineKeyBindingFunctions from './ViewletDefineKeyBindingFunctions.js'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'

export const handleKeyDown = (event) => {
  Event.preventDefault(event)
  Event.stopPropagation(event)
  const uid = ComponentUid.fromEvent(event)
  const { key, altKey, ctrlKey, shiftKey, metaKey } = event
  ViewletDefineKeyBindingFunctions.handleKeyDown(uid, key, altKey, ctrlKey, shiftKey, metaKey)
}

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletDefineKeyBindingFunctions.handleBlur(uid)
}
