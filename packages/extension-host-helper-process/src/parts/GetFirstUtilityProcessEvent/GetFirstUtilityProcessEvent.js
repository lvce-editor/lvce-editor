import * as FirstUtilityProcessEventType from '../FirstUtilityProcessEventType/FirstUtilityProcessEventType.js'

export const getFirstUtilityProcessEvent = async (parentPort) => {
  const { type, event } = await new Promise((resolve) => {
    const cleanup = (value) => {
      parentPort.off('message', handleMessage)
      resolve(value)
    }
    const handleMessage = (event) => {
      cleanup({
        type: FirstUtilityProcessEventType.Message,
        event,
      })
    }
    parentPort.on('message', handleMessage)
  })
  return {
    type,
    event,
  }
}
