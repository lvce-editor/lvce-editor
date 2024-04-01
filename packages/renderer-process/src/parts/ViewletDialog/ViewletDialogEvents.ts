import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletDialogFunctions from './ViewletDialogFunctions.ts'

export const handleClick = (event) => {
  const { target } = event
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletDialogFunctions.handleClick(index)
}
