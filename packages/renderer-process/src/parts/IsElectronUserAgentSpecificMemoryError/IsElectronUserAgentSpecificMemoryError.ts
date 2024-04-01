import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const isElectronUserAgentSpecificMemoryError = (error) => {
  if (Platform.platform !== PlatformType.Electron) {
    return
  }
  return (
    error.message ===
    `Failed to execute 'measureUserAgentSpecificMemory' on 'Performance': performance.measureUserAgentSpecificMemory is not available.`
  )
}
