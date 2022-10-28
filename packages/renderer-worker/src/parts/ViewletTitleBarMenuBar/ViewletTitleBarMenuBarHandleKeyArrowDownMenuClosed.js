import { openMenu } from './ViewletTitleBarMenuBarOpenMenu.js'

export const handleKeyArrowDownMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}
