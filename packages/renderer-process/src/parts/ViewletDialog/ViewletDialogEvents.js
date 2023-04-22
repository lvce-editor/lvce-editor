import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as ViewletDialogFunctions from './ViewletDialogFunctions.js'

export const handleClick = (event) => {
  const { target } = event
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletDialogFunctions.handleClick(index)
}
