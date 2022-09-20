import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SearchFileRemote from '../SearchFileRemote/SearchFileRemote.js'
import * as SearchFileWeb from '../SearchFileWeb/SearchFileWeb.js'

const getModule = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return SearchFileWeb
    default:
      return SearchFileRemote
  }
}

export const searchFile = (path, value) => {
  const module = getModule()
  return module.searchFile(path, value)
}
