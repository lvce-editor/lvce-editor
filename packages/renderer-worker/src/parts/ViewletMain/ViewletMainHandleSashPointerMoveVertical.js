import * as Viewlet from '../Viewlet/Viewlet.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getAllResizeCommands = (grid, width, x, y, eventX, eventY, tabHeight) => {
  const allCommands = []
  // for (let i = 0; i < grid.length; i++) {
  //   const item = grid[i]
  //   i += grid.childCount.length
  // }
  const firstTabs = grid[0]
  allCommands.push(['Viewlet.setBounds', firstTabs.uid, firstTabs.x, firstTabs.y, eventX, tabHeight])
  const firstContent = grid[1]
  allCommands.push(['Viewlet.setBounds', firstContent.uid, firstContent.x, firstContent.y, eventX, firstContent.height])
  const sash = grid[2]
  allCommands.push(['Viewlet.setBounds', sash.uid, eventX - x, sash.y, sash.width, sash.height])
  const secondTabs = grid[3]
  allCommands.push(['Viewlet.setBounds', secondTabs.uid, eventX, secondTabs.y, width - eventX, tabHeight])
  const secondContent = grid[4]
  allCommands.push(['Viewlet.setBounds', secondContent.uid, eventX, secondContent.y, width - eventX, secondContent.height])
  return allCommands
}

export const handleSashPointerMoveVertical = (state, eventX, eventY) => {
  const { grid, tabHeight, x, y, width } = state
  const allCommands = getAllResizeCommands(grid, width, x, y, eventX, eventY, tabHeight)
  RendererProcess.invoke('Viewlet.sendMultiple', allCommands)
  // TODO
  return state
}
