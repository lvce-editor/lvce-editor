import * as ExtensionHostHelperProcess from '../ExtensionHostHelperProcess/ExtensionHostHelperProcess.js'

export const getJson = async (url) => {
  const json = await ExtensionHostHelperProcess.invoke('Ajax.getJson', url)
  return json
}
