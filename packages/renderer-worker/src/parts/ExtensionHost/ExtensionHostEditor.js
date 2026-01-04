import * as ExtensionHostShared from './ExtensionHostShared.js'

/**
 *
 * @param {any} param0
 * @returns
 */
export const execute = ({
  editor,
  args,
  event,
  method,
  combineResults,
  noProviderFoundMessage,
  noProviderFoundResult = undefined,
  assetDir,
  platform,
}) => {
  return ExtensionHostShared.executeProviders({
    event: `${event}:${editor.languageId}`,
    method: method,
    params: [editor.uid, ...args],
    noProviderFoundMessage,
    combineResults: combineResults,
    noProviderFoundResult,
    assetDir,
    platform,
  })
}
