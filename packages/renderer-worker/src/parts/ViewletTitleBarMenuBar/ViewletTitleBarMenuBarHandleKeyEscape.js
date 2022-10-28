import { handleKeyEscapeMenuClosed } from './ViewletTitleBarMenuBarHandleKeyEscapeMenuClosed.js'
import { handleKeyEscapeMenuOpen } from './ViewletTitleBarMenuBarHandleKeyEscapeMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyEscape = ifElse(
  handleKeyEscapeMenuOpen,
  handleKeyEscapeMenuClosed
)
