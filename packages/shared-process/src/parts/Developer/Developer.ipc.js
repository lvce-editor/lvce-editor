import * as Developer from './Developer.js'

// prettier-ignore
export const Commands = {
  'Developer.allocateMemory': Developer.allocateMemory,
  'Developer.crashSharedProcess': Developer.crashSharedProcess,
  'Developer.createHeapSnapshot': Developer.createHeapSnapshot,
  'Developer.createProfile': Developer.createProfile,
  'Developer.getNodeStartupTime': Developer.getNodeStartupTiming,
  'Developer.getNodeStartupTiming': Developer.getNodeStartupTiming,
  'Developer.sharedProcessMemoryUsage': Developer.sharedProcessMemoryUsage,
  'Developer.sharedProcessStartupPerformance': Developer.sharedProcessStartupPerformance,
}
