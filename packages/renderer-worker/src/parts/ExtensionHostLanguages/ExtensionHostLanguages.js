import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'

export const load = async (language, assetDir, platform) => {
  await ExtensionHostManagement.activateByEvent(`onLanguage:${language}`, assetDir, platform)
}
