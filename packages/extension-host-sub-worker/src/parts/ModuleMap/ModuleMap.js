const getPrefix = (commandId) => {
  if (!commandId || typeof commandId !== 'string') {
    return commandId
  }
  return commandId.slice(0, commandId.indexOf('.'))
}

export const getModuleId = (commandId) => {
  const prefix = getPrefix(commandId)
  switch (prefix) {
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
