import * as Command from '../Command/Command.js'
import * as Developer from './Developer.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('Developer.sharedProcessStartupPerformance', Developer.sharedProcessStartupPerformance)
  Command.register('Developer.sharedProcessMemoryUsage', Developer.sharedProcessMemoryUsage)
  Command.register('Developer.allocateMemory', Developer.allocateMemory)
  Command.register('Developer.crashSharedProcess', Developer.crashSharedProcess)
  Command.register('Developer.createHeapSnapshot', Developer.createHeapSnapshot)
  Command.register('Developer.createProfile', Developer.createProfile)
  Command.register('Developer.getNodeStartupTiming', Developer.getNodeStartupTiming)
  Command.register('Developer.getNodeStartupTime', Developer.getNodeStartupTiming)
}
