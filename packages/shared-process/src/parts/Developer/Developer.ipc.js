import * as Developer from './Developer.js'
import * as CpuProfile from '../CpuProfile/CpuProfile.js'

export const name = 'Developer'

// prettier-ignore
export const Commands = {
  allocateMemory: Developer.allocateMemory,
  crashSharedProcess: Developer.crashSharedProcess,
  createHeapSnapshot: Developer.createHeapSnapshot,
  createProfile: CpuProfile.createProfile,
  getNodeStartupTime: Developer.getNodeStartupTiming,
  getNodeStartupTiming: Developer.getNodeStartupTiming,
  sharedProcessMemoryUsage: Developer.sharedProcessMemoryUsage,
  sharedProcessStartupPerformance: Developer.sharedProcessStartupPerformance,
}
