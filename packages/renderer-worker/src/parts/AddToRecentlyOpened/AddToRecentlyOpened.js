import * as AddPath from '../AddPath/AddPath.js'
import * as GetRecentlyOpened from '../GetRecentlyOpened/GetRecentlyOpened.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SetRecentlyOpened from '../SetRecentlyOpened/SetRecentlyOpened.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

const addToRecentlyOpenedWeb = async (path) => {
  const recentlyOpened = await GetRecentlyOpened.getRecentlyOpened()
  const newRecentlyOpened = AddPath.addPath(recentlyOpened, path)
  await SetRecentlyOpened.setRecentlyOpened(newRecentlyOpened)
}

const addToRecentlyOpenedRemote = async (path) => {
  await SharedProcess.invoke(SharedProcessCommandType.RecentlyOpenedAddPath, path)
}

export const addToRecentlyOpened = async (path) => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
    case PlatformType.Remote:
      return addToRecentlyOpenedRemote(path)
    case PlatformType.Web:
      return addToRecentlyOpenedWeb(path)
    default:
  }
}
