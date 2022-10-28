import { openMenu } from './ViewletTitleBarMenuBarOpenMenu.js'

export const handleKeyEnterMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}
