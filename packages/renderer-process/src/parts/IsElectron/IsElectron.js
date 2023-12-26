import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const isElectron = Platform.platform === PlatformType.Electron
