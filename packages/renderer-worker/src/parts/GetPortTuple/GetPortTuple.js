export const getPortTuple = (initialPort) => {
  if (initialPort) {
    return {
      port1: undefined,
      port2: initialPort,
    }
  }
  const { port1, port2 } = new MessageChannel()
  return { port1, port2 }
}
