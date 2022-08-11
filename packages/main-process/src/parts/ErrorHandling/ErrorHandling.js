const { dialog } = require('electron')

const getDisplayMessage = (error) => {
  if (!error || !error.stack) {
    return `<unknown error>`
  }

  return `${error.stack}`
}

const printError = (error) => {
  console.error(`[main-process] ${error.stack}`)
}

const showError = (error) => {
  const displayMessage = getDisplayMessage(error)
  dialog.showErrorBox('Error', displayMessage)
}

exports.handleError = (error) => {
  printError(error)
  showError(error)
}
