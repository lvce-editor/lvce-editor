import * as Developer from './Developer.js'
import * as Crash from '../Crash/Crash.js'

export const name = 'Developer'

// prettier-ignore
export const Commands = {
  allocateMemory: Developer.allocateMemory,
  crashSharedProcess: Crash.crashSharedProcess,
  createHeapSnapshot: Developer.createHeapSnapshot,
  createProfile: Developer.createProfile,
  getNodeStartupTime: Developer.getNodeStartupTiming,
  getNodeStartupTiming: Developer.getNodeStartupTiming,
  sharedProcessMemoryUsage: Developer.sharedProcessMemoryUsage,
  sharedProcessStartupPerformance: Developer.sharedProcessStartupPerformance,
}
