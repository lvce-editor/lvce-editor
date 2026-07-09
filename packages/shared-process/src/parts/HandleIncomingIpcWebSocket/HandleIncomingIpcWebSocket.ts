export const handleIncomingIpcWebSocket = async (module, handle, message) => {
  const response = module.upgradeWebSocket(handle, message)
  const target = await module.targetWebSocket(handle, message)
  return {
    target,
    response,
  }
}
