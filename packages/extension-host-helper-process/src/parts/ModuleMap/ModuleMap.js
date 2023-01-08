import * as ModuleId from '../ModuleId/ModuleId.js'

const getPrefix = (commandId) => {
  if (!commandId || typeof commandId !== 'string') {
    return commandId
  }
  return commandId.slice(0, commandId.indexOf('.'))
}

export const getModuleId = (commandId) => {
  const prefix = getPrefix(commandId)
  switch (prefix) {
    case 'Exec':
      return ModuleId.Exec
    case 'Ajax':
      return ModuleId.Ajax
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
