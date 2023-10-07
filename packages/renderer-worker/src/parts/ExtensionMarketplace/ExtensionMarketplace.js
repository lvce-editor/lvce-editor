import * as Command from '../Command/Command.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const getMarketplaceExtensions = async (props) => {
  const marketplaceUrl = await PlatformPaths.getMarketPlaceUrl()
  const options = {
    searchParams: props,
  }
  return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ `${marketplaceUrl}/api/extensions/search`, /* options */ options)
}
