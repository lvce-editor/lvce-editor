import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'

export const saveTimings = async (builtinSaveStart, builtinSaveEnd, extensionSaveEnd) => {
  await InstanceStorage.setJson('Timings', {
    builtinSaveTime: builtinSaveEnd - builtinSaveStart,
    extensionSaveTime: extensionSaveEnd - builtinSaveEnd,
  })
}
