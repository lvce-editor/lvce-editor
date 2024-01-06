export const serialize = (message) => {
  return JSON.stringify(message)
}

export const deserialize = (message) => {
  return JSON.parse(message.toString())
}
