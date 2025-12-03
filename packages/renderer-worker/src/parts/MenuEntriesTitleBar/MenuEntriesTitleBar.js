import * as Platform from '../Platform/Platform.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getModule = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
      return import('./MenuEntriesTitleBarWeb.js')
    default:
      return import('./MenuEntriesTitleBarRemote.js')
  }
}

export const id = MenuEntryId.TitleBar

export const getMenuEntries = async () => {
  const module = await getModule()
  return module.getMenuEntries()
}
