import * as ViewletDialog from './ViewletDialog.js'

export const name = 'Dialog'

export const Commands = {
  close: ViewletDialog.dispose,
  handleClick: ViewletDialog.handleClick,
}

export * from './ViewletDialogCss.js'
export * from './ViewletDialog.js'
