import * as Viewlet from '../Viewlet/Viewlet.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const getAllResizeCommands = (grid, width, x, y, eventX, eventY, tabHeight) => {
  const allCommands = []
  // for (let i = 0; i < grid.length; i++) {
  //   const item = grid[i]
  //   i += grid.childCount.length
  // }
  const branch = grid[0]
  const leafOne = grid[1]
  const leafTwo = grid[2]
  allCommands.push(['Viewlet.setBounds', leafOne.tabsUid, leafOne.x, leafOne.y - tabHeight, eventX, tabHeight])
  allCommands.push(['Viewlet.setBounds', leafOne.uid, leafOne.x, leafOne.y + tabHeight, eventX, leafOne.height - tabHeight])
  // allCommands.push(['Viewlet.setBounds', sash.uid, eventX - x, sash.y, sash.width, sash.height])
  allCommands.push(['Viewlet.setBounds', leafTwo.tabsUid, eventX, leafTwo.y - tabHeight, width - eventX, tabHeight])
  allCommands.push(['Viewlet.setBounds', leafTwo.uid, eventX, leafTwo.y, width - eventX, leafTwo.height - tabHeight])
  return allCommands
}

export const handleSashPointerMoveVertical = (state, eventX, eventY) => {
  const { grid, tabHeight, x, y, width } = state
  const allCommands = getAllResizeCommands(grid, width, x, y, eventX, eventY, tabHeight)
  RendererProcess.invoke('Viewlet.sendMultiple', allCommands)
  // TODO
  return state
}
