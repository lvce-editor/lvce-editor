import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getModule = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return import('./ViewletExplorerHandleDropRootElectron.js')
    default:
      return import('./ViewletExplorerHandleDropRootDefault.js')
  }
}

export const handleDropRoot = async (state, files) => {
  const module = await getModule()
  return module.handleDrop(state, files)
}
