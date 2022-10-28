import { handleKeyArrowUpMenuClosed } from './ViewletTitleBarMenuBarHandleKeyArrowUpMenuClosed.js'
import { handleKeyArrowUpMenuOpen } from './ViewletTitleBarMenuBarHandleKeyArrowUpMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyArrowUp = ifElse(
  handleKeyArrowUpMenuOpen,
  handleKeyArrowUpMenuClosed
)
