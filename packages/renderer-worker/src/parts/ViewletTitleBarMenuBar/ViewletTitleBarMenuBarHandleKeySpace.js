import { handleKeySpaceMenuClosed } from './ViewletTitleBarMenuBarHandleKeySpaceMenuClosed.js'
import { handleKeySpaceMenuOpen } from './ViewletTitleBarMenuBarHandleKeySpaceMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

// TODO this is same as handle key enter -> merge the functions
export const handleKeySpace = ifElse(
  handleKeySpaceMenuOpen,
  handleKeySpaceMenuClosed
)
