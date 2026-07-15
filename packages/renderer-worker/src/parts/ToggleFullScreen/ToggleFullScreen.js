import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const toggleFullScreen = () => {
  if (Platform.getPlatform() === PlatformType.Electron) {
    return Command.execute('ElectronWindow.toggleFullScreen')
  }
  return RendererProcess.invoke('Window.toggleFullScreen')
}
