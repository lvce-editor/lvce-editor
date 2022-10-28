import { handleKeyArrowDownMenuOpen } from './ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js'

export const handleKeyArrowDown = ifElse(
  handleKeyArrowDownMenuOpen,
  handleKeyArrowDownMenuClosed
)
