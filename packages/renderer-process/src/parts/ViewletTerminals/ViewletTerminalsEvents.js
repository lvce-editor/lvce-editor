import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import { getNodeIndex } from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletTerminalsFunctions from './ViewletTerminalsFunctions.js'

export const handleClickTab = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const index = getNodeIndex(target)
  ViewletTerminalsFunctions.handleClickTab(uid, index)
}
