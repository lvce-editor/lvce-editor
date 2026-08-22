const duration = 90 * 24 * 60 * 60 * 1000

export const getExpirationDate = (now = Date.now()) => {
  return new Date(now + duration).toUTCString()
}
