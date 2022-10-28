import { handleKeyArrowLeftMenuClosed } from './ViewletTitleBarMenuBarHandleKeyArrowLeftMenuClosed.js'
import { handleKeyArrowLeftMenuOpen } from './ViewletTitleBarMenuBarHandleKeyArrowLeftMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyArrowLeft = ifElse(
  handleKeyArrowLeftMenuOpen,
  handleKeyArrowLeftMenuClosed
)
