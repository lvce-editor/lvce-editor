export const handleIncomingIpcMessagePort = async (module, handle, message) => {
  const response = module.upgradeMessagePort(handle, message)
  const target = await module.targetMessagePort(handle, message)
  return {
    target,
    response,
  }
}
