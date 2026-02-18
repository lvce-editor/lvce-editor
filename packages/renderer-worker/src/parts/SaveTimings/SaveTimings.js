import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'

const roundToMilliseconds = (value) => {
  return Math.round(value)
}

export const saveTimings = async (builtinSaveStart, builtinSaveEnd, extensionSaveEnd) => {
  await InstanceStorage.setJson('Timings', {
    builtinSaveTime: roundToMilliseconds(builtinSaveEnd - builtinSaveStart),
    extensionSaveTime: roundToMilliseconds(extensionSaveEnd - builtinSaveEnd),
  })
}
