import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ViewletTitleBarButtonsFunctions from './ViewletTitleBarButtonsFunctions.ts'

/**
 *
 * @param {MouseEvent} event
 */
export const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarButtonsFunctions.handleClick(uid, target.className)
}
