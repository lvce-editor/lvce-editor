import * as CpuProfile from '../CpuProfile/CpuProfile.js'
import * as Crash from '../Crash/Crash.js'
import * as HeapSnapshot from '../HeapSnapshot/HeapSnapshot.js'
import * as Developer from './Developer.js'

export const Commands = {
  'Developer.allocateMemory': Developer.allocateMemory,
  'Developer.crashSharedProcess': Crash.crashSharedProcess,
  'Developer.createHeapSnapshot': HeapSnapshot.createHeapSnapshot,
  'Developer.createProfile': CpuProfile.createProfile,
  'Developer.sharedProcessMemoryUsage': Developer.sharedProcessMemoryUsage,
  'Developer.sharedProcessStartupPerformance': Developer.sharedProcessStartupPerformance,
}
