import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

let activeElectronInvocations = 0

export const showAbout = async () => {
  const platform = Platform.getPlatform()
  if (platform === PlatformType.Electron) {
    activeElectronInvocations++
  }
  try {
    await AboutViewWorker.invoke('About.showAbout', platform)
  } finally {
    if (platform === PlatformType.Electron) {
      activeElectronInvocations--
      if (activeElectronInvocations === 0) {
        await AboutViewWorker.dispose()
      }
    }
  }
}
