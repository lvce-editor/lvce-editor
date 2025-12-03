import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Command from '../Command/Command.js'

export const minimize = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.minimize')
    default:
      throw new Error('not implemented')
  }
}

export const maximize = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.maximize')
    default:
      throw new Error('not implemented')
  }
}

export const unmaximize = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.unmaximize')
    default:
      throw new Error('not implemented')
  }
}

export const close = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.close')
    default:
      throw new Error('not implemented')
  }
}

export const exit = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('Exit.exit')
    default:
      throw new Error('not implemented')
  }
}

export const openNew = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.openNew')
    default:
      throw new Error('not implemented')
  }
}

export const zoomIn = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.zoomIn')
    default:
      throw new Error('not implemented')
  }
}

export const zoomOut = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.zoomOut')
    default:
      throw new Error('not implemented')
  }
}

export const zoomReset = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return Command.execute('ElectronWindow.zoomReset')
    default:
      throw new Error('not implemented')
  }
}
