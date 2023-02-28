import { handleMouseOutMenuClosed } from './ViewletTitleBarMenuBarHandleMouseOutMenuClosed.js'
import { handleMouseOutMenuOpen } from './ViewletTitleBarMenuBarHandleMouseOutMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleMouseOut = ifElse(handleMouseOutMenuOpen, handleMouseOutMenuClosed)
