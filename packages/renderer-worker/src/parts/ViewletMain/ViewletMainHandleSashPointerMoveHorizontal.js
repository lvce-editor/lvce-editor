import * as Viewlet from '../Viewlet/Viewlet.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getAllResizeCommands = (grid, x, y, eventX, eventY, tabHeight) => {
  const allCommands = []
  // for (let i = 0; i < grid.length; i++) {
  //   const item = grid[i]
  //   i += grid.childCount.length
  // }
  const firstTabs = grid[0]
  allCommands.push(['Viewlet.setBounds', firstTabs.uid, firstTabs.x, firstTabs.y - y, firstTabs.width, tabHeight])
  const firstContent = grid[1]
  allCommands.push(['Viewlet.setBounds', firstContent.uid, firstContent.x, firstContent.y - y, firstContent.width, firstContent.height])
  const sash = grid[2]
  allCommands.push(['Viewlet.setBounds', sash.uid, sash.x, eventY - y, sash.width, sash.height])
  const secondTabs = grid[3]
  allCommands.push(['Viewlet.setBounds', secondTabs.uid, secondTabs.x, eventY - y, secondTabs.width, tabHeight])
  const secondContent = grid[4]
  allCommands.push(['Viewlet.setBounds', secondContent.uid, secondContent.x, eventY - y + tabHeight, secondContent.width, secondContent.height])
  return allCommands
}

export const handleSashPointerMoveHorizontal = (state, eventX, eventY) => {
  const { grid, tabHeight, x, y } = state
  const allCommands = getAllResizeCommands(grid, x, y, eventX, eventY, tabHeight)
  RendererProcess.invoke('Viewlet.sendMultiple', allCommands)
  // TODO
  return state
}
