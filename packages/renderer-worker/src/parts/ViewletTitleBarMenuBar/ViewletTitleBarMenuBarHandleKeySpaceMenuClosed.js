import { openMenu } from './ViewletTitleBarMenuBarOpenMenu.js'

export const handleKeySpaceMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}
