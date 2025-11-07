import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'

export const saveTimings = async (builtinSaveStart, builtinSaveEnd, extensionSaveEnd) => {
  console.log({
    builtinSaveTime: builtinSaveEnd - builtinSaveStart,
    extensionSaveTime: extensionSaveEnd - builtinSaveEnd,
  })
  await LocalStorage.setJson('Timings', {
    builtinSaveTime: builtinSaveEnd - builtinSaveStart,
    extensionSaveTime: extensionSaveEnd - builtinSaveEnd,
  })
}
