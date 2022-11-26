class VError extends Error {
  constructor(error, message) {
    super(`${message}: ${error.message}`)
  }
}

export const api = {
  VError,
}
