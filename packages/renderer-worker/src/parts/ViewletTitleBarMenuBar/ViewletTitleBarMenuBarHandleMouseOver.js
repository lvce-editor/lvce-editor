import { handleReadmeContextMenu } from '../ViewletExtensionDetail/ViewletExtensionDetailHandleReadmeContextMenu.js'
import { handleMouseOverMenuOpen } from './ViewletTitleBarMenuBarHandleMouseOverMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleMouseOver = ifElse(
  handleMouseOverMenuOpen,
  handleReadmeContextMenu
)
