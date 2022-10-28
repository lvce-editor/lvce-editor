import { handleKeyEndMenuClosed } from './ViewletTitleBarMenuBarHandleKeyEndMenuClosed.js'
import { handleKeyEndMenuOpen } from './ViewletTitleBarMenuBarHandleKeyEndMenuOpen.js'
import { ifElse } from './ViewletTitleBarMenuBarIfElse.js'

// TODO this is also use for pagedown -> maybe find a better name for this function
export const handleKeyEnd = ifElse(handleKeyEndMenuOpen, handleKeyEndMenuClosed)
