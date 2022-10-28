import { handleKeyEnterMenuClosed } from './ViewletTitleBarMenuBarHandleKeyEnterMenuClosed.js'
import { handleKeyEnterMenuOpen } from './ViewletTitleBarMenuBarHandleKeyEnterMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyEnter = ifElse(
  handleKeyEnterMenuOpen,
  handleKeyEnterMenuClosed
)
