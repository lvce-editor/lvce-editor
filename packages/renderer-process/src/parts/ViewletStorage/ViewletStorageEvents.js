import * as ComponentUid from '../ComponentUid/componentuid.ts'
import * as ViewletStorageFunctions from './ViewletStorageFunctions.js'

export const handleClick = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletStorageFunctions.handleClick(uid)
}
