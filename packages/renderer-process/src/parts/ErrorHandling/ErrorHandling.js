export const handleError = (error) => {
  if (`${error}` === 'Script error.') {
    // ignore errors from chrome extensions
    return
  }
  console.info(`[renderer-process] Unhandled Error: ${error}`)
  alert(error)
}

export const handleUnhandledRejection = (event) => {
  console.info(`[renderer-process] Unhandled Rejection: ${event.reason}`)
  alert(event.reason)
}
