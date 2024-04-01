import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ViewletTitleBarButtonsFunctions from './ViewletTitleBarButtonsFunctions.js'

/**
 *
 * @param {MouseEvent} event
 */
export const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  // @ts-ignore
  ViewletTitleBarButtonsFunctions.handleClick(uid, target.className)
}
