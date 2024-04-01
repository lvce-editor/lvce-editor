import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

export const isElectronUserAgentSpecificMemoryError = (error) => {
  if (Platform.platform !== PlatformType.Electron) {
    return
  }
  return (
    error.message ===
    `Failed to execute 'measureUserAgentSpecificMemory' on 'Performance': performance.measureUserAgentSpecificMemory is not available.`
  )
}
