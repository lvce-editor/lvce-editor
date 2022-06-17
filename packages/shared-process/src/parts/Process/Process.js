export const crash = (message) => {
  throw new Error(message)
}

export const crashAsync = async (message) => {
  throw new Error(message)
}
