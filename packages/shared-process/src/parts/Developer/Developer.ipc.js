import * as Crash from '../Crash/Crash.js'
import * as HeapSnapshot from '../HeapSnapshot/HeapSnapshot.js'
import * as Developer from './Developer.js'

export const name = 'Developer'

export const Commands = {
  allocateMemory: Developer.allocateMemory,
  createHeapSnapshot: HeapSnapshot.createHeapSnapshot,
  crashSharedProcess: Crash.crashSharedProcess,
  createProfile: Developer.createProfile,
  getNodeStartupTime: Developer.getNodeStartupTiming,
  getNodeStartupTiming: Developer.getNodeStartupTiming,
  sharedProcessMemoryUsage: Developer.sharedProcessMemoryUsage,
  sharedProcessStartupPerformance: Developer.sharedProcessStartupPerformance,
}
