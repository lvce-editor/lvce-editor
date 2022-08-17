const combineMessages = (error, message) => {
  if (error && error.message) {
    return `${message}: ${error.message}`
  }
  return `${error}`
}

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = combineMessages(error, message)
    super(combinedMessage)
    this.name = 'VError'
  }
}
