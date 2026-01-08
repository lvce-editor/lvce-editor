import * as ExtensionHostShared from './ExtensionHostShared.js'
import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'

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
  assetDir = AssetDir.assetDir,
  platform = Platform.getPlatform(),
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
