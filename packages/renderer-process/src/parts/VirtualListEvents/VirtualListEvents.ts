import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as VirtualListFunctions from '../VirtualListFunctions/VirtualListFunctions.js'

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  VirtualListFunctions.handleWheel(uid, deltaMode, deltaY)
}
