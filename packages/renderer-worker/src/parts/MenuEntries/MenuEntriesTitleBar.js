import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getModule = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return import('./MenuEntriesTitleBarWeb.js')
    default:
      return import('./MenuEntriesTitleBarRemote.js')
  }
}

export const getMenuEntries = async () => {
  const module = await getModule()
  return module.getMenuEntries()
}
