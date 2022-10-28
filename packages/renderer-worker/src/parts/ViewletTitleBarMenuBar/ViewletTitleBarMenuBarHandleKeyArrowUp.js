import { handleKeyArrowUpMenuClosed } from './ViewletTitleBarMenuBarHandleKeyArrowUpMenuClosed.js'
import { handleKeyArrowUpMenuOpen } from './ViewletTitleBarMenuBarHandleKeyArrowUpMenuOpen.js'

export const handleKeyArrowUp = ifElse(
  handleKeyArrowUpMenuOpen,
  handleKeyArrowUpMenuClosed
)
