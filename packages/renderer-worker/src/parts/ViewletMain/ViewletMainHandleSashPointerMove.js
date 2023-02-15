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
  allCommands.push(['Viewlet.setBounds', firstTabs.uid, firstTabs.x, firstTabs.y - y, eventX, tabHeight])
  const firstContent = grid[1]
  allCommands.push(['Viewlet.setBounds', firstContent.uid, firstContent.x, firstContent.y - y, eventX, firstContent.height])
  const secondTabs = grid[2]
  allCommands.push(['Viewlet.setBounds', secondTabs.uid, eventX, secondTabs.y, secondTabs.width, tabHeight])
  const secondContent = grid[3]
  allCommands.push(['Viewlet.setBounds', secondContent.uid, eventX, secondContent.y, secondContent.width, secondContent.height])
  allCommands.push(['Viewlet.send', ViewletModuleId.Main, 'setSashPosition', eventX - x, firstTabs.y - y])
  return allCommands
}

export const handleSashPointerMove = (state, eventX, eventY) => {
  const { grid, tabHeight, x, y } = state
  const allCommands = getAllResizeCommands(grid, x, y, eventX, eventY, tabHeight)
  RendererProcess.invoke('Viewlet.sendMultiple', allCommands)
  // TODO
  return state
}
