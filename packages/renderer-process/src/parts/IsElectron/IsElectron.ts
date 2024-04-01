import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const isElectron = Platform.platform === PlatformType.Electron
