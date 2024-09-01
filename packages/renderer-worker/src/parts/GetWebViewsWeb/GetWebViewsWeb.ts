import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'

export const getWebViewsWeb = async () => {
  const url = `${AssetDir.assetDir}/config/webViews.json`
  // TODO move this to shared-process-web / network-process-web
  // TODO handle error ?
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
}
