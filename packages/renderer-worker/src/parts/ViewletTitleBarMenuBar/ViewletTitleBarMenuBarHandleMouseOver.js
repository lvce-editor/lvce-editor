import { handleMouseOverMenuClosed } from './ViewletTitleBarMenuBarHandleMouseOverMenuClosed.js'
import { handleMouseOverMenuOpen } from './ViewletTitleBarMenuBarHandleMouseOverMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleMouseOver = ifElse(
  handleMouseOverMenuOpen,
  handleMouseOverMenuClosed
)
