import * as ViewletTitleBarButtonsFunctions from './ViewletTitleBarButtonsFunctions.js'

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
      ViewletTitleBarButtonsFunctions.handleClickMinmize()
      break
    case 'TitleBarButtonToggleMaximize':
      ViewletTitleBarButtonsFunctions.handleClickToggleMaximize()
      break
    case 'TitleBarButtonClose':
      ViewletTitleBarButtonsFunctions.handleClickClose()
      break
    default:
      break
  }
}
