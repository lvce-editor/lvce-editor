import * as ViewletTitleBarFunctions from './ViewletTitleBarFunctions.js'

/**
 *
 * @param {MouseEvent} event
 */
export const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  // @ts-ignore
  const { id } = target
  switch (id) {
    case 'TitleBarButtonMinimize':
      ViewletTitleBarFunctions.handleTitleBarButtonClickMinmize()
      break
    case 'TitleBarButtonToggleMaximize':
      ViewletTitleBarFunctions.handleTitleBarButtonClickToggleMaximize()
      break
    case 'TitleBarButtonClose':
      ViewletTitleBarFunctions.handleTitleBarButtonClickClose()
      break
    default:
      break
  }
}
