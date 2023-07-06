import * as CpuProfile from '../CpuProfile/CpuProfile.js'
import * as Crash from '../Crash/Crash.js'
import * as HeapSnapshot from '../HeapSnapshot/HeapSnapshot.js'
import * as Developer from './Developer.js'

export const name = 'Developer'

export const Commands = {
  allocateMemory: Developer.allocateMemory,
  crashSharedProcess: Crash.crashSharedProcess,
  createHeapSnapshot: HeapSnapshot.createHeapSnapshot,
  createProfile: CpuProfile.createProfile,
  getNodeStartupTime: Developer.getNodeStartupTiming,
  getNodeStartupTiming: Developer.getNodeStartupTiming,
  sharedProcessMemoryUsage: Developer.sharedProcessMemoryUsage,
  sharedProcessStartupPerformance: Developer.sharedProcessStartupPerformance,
}
