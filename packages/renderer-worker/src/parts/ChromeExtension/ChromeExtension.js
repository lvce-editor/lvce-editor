import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ChromeExtensionUrl from '../ChromeExtensionUrl/ChromeExtensionUrl.js'

export const install = async (name) => {
  const url = ChromeExtensionUrl.getUrl(name)
  return SharedProcess.invoke('ChromeExtension.install', name, url)
}

export const uninstall = (name) => {
  return SharedProcess.invoke('ChromeExtension.uninstall', name)
}
