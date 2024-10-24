import * as LocalStorage from '../LocalStorage/LocalStorage.js'

export const getJson = () => {
  return LocalStorage.getJson('ExtensionStateStorage')
}

export const setJson = (value) => {
  return LocalStorage.setJson('ExtensionStateStorage', value)
}
