import * as ViewletDialogFunctions from './ViewletDialogFunctions.js'

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

export const handleClick = (event) => {
  const { target } = event
  const index = getNodeIndex(target)
  ViewletDialogFunctions.handleClick(index)
}
