import * as InstanceStorage from '../LocalStorage/LocalStorage.js'

export const saveTimings = async (builtinSaveStart, builtinSaveEnd, extensionSaveEnd) => {
  await InstanceStorage.setJson('Timings', {
    builtinSaveTime: builtinSaveEnd - builtinSaveStart,
    extensionSaveTime: extensionSaveEnd - builtinSaveEnd,
  })
}
