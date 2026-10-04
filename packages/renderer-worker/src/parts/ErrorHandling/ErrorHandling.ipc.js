import * as ErrorHandling from './ErrorHandling.js'

export const name = 'ErrorHandling'

export const Commands = {
  handleError: ErrorHandling.handleError,
  preparePrettyError: ErrorHandling.preparePrettyError,
  showErrorDialog: ErrorHandling.showErrorDialog,
}
