import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ViewletTitleBarButtonsFunctions from './ViewletTitleBarButtonsFunctions.js'

/**
 *
 * @param {MouseEvent} event
 */
export const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  // @ts-ignore
  const { id } = target
  switch (id) {
    case 'TitleBarButtonMinimize':
      ViewletTitleBarButtonsFunctions.handleClickMinimize(uid)
      break
    case 'TitleBarButtonToggleMaximize':
      ViewletTitleBarButtonsFunctions.handleClickToggleMaximize(uid)
      break
    case 'TitleBarButtonClose':
      ViewletTitleBarButtonsFunctions.handleClickClose(uid)
      break
    default:
      break
  }
}
