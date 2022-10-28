import { handleKeyHomeMenuClosed } from './ViewletTitleBarMenuBarHandleKeyHomeMenuClosed.js'
import { handleKeyHomeMenuOpen } from './ViewletTitleBarMenuBarHandleKeyHomeMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyHome = ifElse(
  handleKeyHomeMenuOpen,
  handleKeyHomeMenuClosed
)
