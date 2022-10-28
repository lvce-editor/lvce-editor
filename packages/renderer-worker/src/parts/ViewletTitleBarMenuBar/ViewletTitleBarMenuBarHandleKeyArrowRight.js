import { handleKeyArrowRightMenuClosed } from './ViewletTitleBarMenuBarHandleKeyArrowRightMenuClosed.js'
import { handleKeyArrowRightMenuOpen } from './ViewletTitleBarMenuBarHandleKeyArrowRightMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

export const handleKeyArrowRight = ifElse(
  handleKeyArrowRightMenuOpen,
  handleKeyArrowRightMenuClosed
)
