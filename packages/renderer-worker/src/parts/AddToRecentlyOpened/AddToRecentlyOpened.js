import * as GetRecentlyOpened from '../GetRecentlyOpened/GetRecentlyOpened.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SetRecentlyOpened from '../SetRecentlyOpened/SetRecentlyOpened.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

const getNewRecentlyOpened = (recentlyOpened, path) => {
  const index = recentlyOpened.indexOf(path)
  if (index === -1) {
    return [path, ...recentlyOpened]
  }
  return [path, ...recentlyOpened.slice(0, index), ...recentlyOpened.slice(index + 1)]
}

const addToRecentlyOpenedWeb = async (path) => {
  const recentlyOpened = await GetRecentlyOpened.getRecentlyOpened()
  const newRecentlyOpened = getNewRecentlyOpened(recentlyOpened, path)
  await SetRecentlyOpened.setRecentlyOpened(newRecentlyOpened)
}

const addToRecentlyOpenedRemote = async (path) => {
  await SharedProcess.invoke(SharedProcessCommandType.RecentlyOpenedAddPath, path)
}

export const addToRecentlyOpened = async (path) => {
  switch (Platform.platform) {
    case PlatformType.Electron:
    case PlatformType.Remote:
      return addToRecentlyOpenedRemote(path)
    case PlatformType.Web:
      return addToRecentlyOpenedWeb(path)
    default:
      return
  }
}
