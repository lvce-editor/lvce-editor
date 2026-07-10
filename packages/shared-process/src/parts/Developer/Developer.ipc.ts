import * as CpuProfile from '../CpuProfile/CpuProfile.ts'
import * as Crash from '../Crash/Crash.ts'
import * as HeapSnapshot from '../HeapSnapshot/HeapSnapshot.ts'
import * as Developer from './Developer.ts'

export const Commands = {
  'Developer.allocateMemory': Developer.allocateMemory,
  'Developer.crashSharedProcess': Crash.crashSharedProcess,
  'Developer.createHeapSnapshot': HeapSnapshot.createHeapSnapshot,
  'Developer.createProfile': CpuProfile.createProfile,
  'Developer.sharedProcessMemoryUsage': Developer.sharedProcessMemoryUsage,
  'Developer.sharedProcessStartupPerformance': Developer.sharedProcessStartupPerformance,
  'Developer.showGpuInfo': Developer.showGpuInfo,
}
