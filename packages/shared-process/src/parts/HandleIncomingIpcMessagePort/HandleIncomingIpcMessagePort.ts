export const handleIncomingIpcMessagePort = async (module: any, handle: any, message: any): Promise<any> => {
  if (module.connectMessagePort) return module.connectMessagePort(handle, message)
  const response = module.upgradeMessagePort(handle, message)
  const target = await module.targetMessagePort(handle, message)
  return {
    response,
    target,
  }
}
