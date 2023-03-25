import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const checkForUpdates = async () => {
  const info = await ElectronProcess.invoke('AutoUpdater.checkForUpdatesAndNotify')
  console.log({ info })
}
