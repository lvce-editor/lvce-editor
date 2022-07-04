import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'

export const getMarketplaceExtensions = async (props) => {
  const marketplaceUrl = await Platform.getMarketPlaceUrl()
  const options = {
    searchParams: props,
  }
  return Command.execute(
    /* Ajax.getJson */ 'Ajax.getJson',
    /* url */ `${marketplaceUrl}/api/extensions/search`,
    /* options */ options
  )
}
