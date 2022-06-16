export const send = (message) => {
  // @ts-ignore
  process.send(message)
}

export const isActive = () => Boolean(process.send)

export const onMessage = (listener) => {
  process.on('message', listener)
}
