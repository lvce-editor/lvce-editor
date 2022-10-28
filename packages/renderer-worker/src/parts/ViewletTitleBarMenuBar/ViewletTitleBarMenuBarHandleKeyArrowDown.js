import { handleKeyArrowDownMenuOpen } from './ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyArrowDown = ifElse(
  handleKeyArrowDownMenuOpen,
  handleKeyArrowDownMenuClosed
)
