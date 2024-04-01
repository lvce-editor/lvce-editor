import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ViewletStorageFunctions from './ViewletStorageFunctions.ts'

export const handleClick = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletStorageFunctions.handleClick(uid)
}
