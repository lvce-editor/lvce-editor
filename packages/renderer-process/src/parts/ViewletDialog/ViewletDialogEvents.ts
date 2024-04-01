import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletDialogFunctions from './ViewletDialogFunctions.js'

export const handleClick = (event) => {
  const { target } = event
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletDialogFunctions.handleClick(index)
}
