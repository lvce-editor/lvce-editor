export const handleIncomingIpcMessagePort = async (module: any, handle: any, message: any): Promise<any> => {
  const response = module.upgradeMessagePort(handle, message)
  const target = await module.targetMessagePort(handle, message)
  return {
    target,
    response,
  }
}
