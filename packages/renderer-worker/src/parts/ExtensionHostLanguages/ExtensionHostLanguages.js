import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'

export const load = async (language) => {
  await ExtensionHostManagement.activateByEvent(`onLanguage:${language}`)
}
