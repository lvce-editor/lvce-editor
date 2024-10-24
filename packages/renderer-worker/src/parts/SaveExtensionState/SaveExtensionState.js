import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'

const getExtensionStateToSave = async () => {
  const items = {
    x: 1,
  }
  return items
}

export const saveExtensionState = async () => {
  const state = await getExtensionStateToSave()
  await InstanceStorage.setJson('ExtensionState', state)
}
