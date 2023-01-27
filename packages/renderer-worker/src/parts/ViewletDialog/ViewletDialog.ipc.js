import * as ViewletDialog from './ViewletDialog.js'

export const name = 'Dialog'

export const Commands = {
  close: ViewletDialog.dispose,
  handleClick: ViewletDialog.handleClick,
}

export const Css = ['/css/parts/ViewletDialog.css', '/css/parts/IconButton.css']

export * from './ViewletDialog.js'
