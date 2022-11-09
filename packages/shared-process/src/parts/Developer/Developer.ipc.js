import * as Developer from './Developer.js'

export const name = 'Developer'

// prettier-ignore
export const Commands = {
  allocateMemory: Developer.allocateMemory,
  crashSharedProcess: Developer.crashSharedProcess,
  createHeapSnapshot: Developer.createHeapSnapshot,
  createProfile: Developer.createProfile,
  getNodeStartupTime: Developer.getNodeStartupTiming,
  getNodeStartupTiming: Developer.getNodeStartupTiming,
  sharedProcessMemoryUsage: Developer.sharedProcessMemoryUsage,
  sharedProcessStartupPerformance: Developer.sharedProcessStartupPerformance,
}
