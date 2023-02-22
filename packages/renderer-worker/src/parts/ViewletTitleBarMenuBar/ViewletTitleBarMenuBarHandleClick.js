import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletTitleBarMenuBarToggleIndex from './ViewletTitleBarMenuBarToggleIndex.js'

export const handleClick = (state, button, index) => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }
  if (index === -1) {
    return state
  }
  return ViewletTitleBarMenuBarToggleIndex.toggleIndex(state, index)
}
