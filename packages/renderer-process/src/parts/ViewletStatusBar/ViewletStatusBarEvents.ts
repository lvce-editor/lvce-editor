import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

export const handleClick = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { clientX, clientY } = event
  ForwardCommand.handleClick(uid, clientX, clientY)
}
