export const handleIncomingIpcWebSocket = async (module: any, handle: any, message: any): Promise<any> => {
  const response = module.upgradeWebSocket(handle, message)
  const target = await module.targetWebSocket(handle, message)
  return {
    response,
    target,
  }
}
