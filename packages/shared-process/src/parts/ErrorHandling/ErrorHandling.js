import * as Socket from '../Socket/Socket.js'

export const state = {
  seenErrors: [],
}

const preparePrettyError = (error) => {
  const cause = error.cause()
  return {
    message: error.message,
    codeFrame: cause.codeFrame,
    stack: cause.stack,
  }
}

const printPrettyError = (prettyError) => {
  console.error(
    `${prettyError.message}\n${prettyError.codeFrame}\n${prettyError.stack}`
  )
}

const JSON_RPC_VERSION = '2.0'

export const handleError = (error) => {
  if (state.seenErrors.includes(error.message)) {
    return
  }
  state.seenErrors.push(error.message)
  const prettyError = preparePrettyError(error)
  Socket.send({
    jsonrpc: JSON_RPC_VERSION,
    method: /* Dialog.showErrorDialogWithOptions */ 'Dialog.showMessage',
    params: [
      {
        message: prettyError.message,
        codeFrame: prettyError.codeFrame,
        stack: prettyError.stack,
      },
    ],
  })
  printPrettyError(prettyError)
}
