import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ViewletStorageFunctions from './ViewletStorageFunctions.js'

export const handleClick = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletStorageFunctions.handleClick(uid)
}
