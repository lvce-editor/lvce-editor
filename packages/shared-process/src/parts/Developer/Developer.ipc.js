import * as Developer from './Developer.js'

// prettier-ignore
export const Commands = {
  'Developer.sharedProcessStartupPerformance': Developer.sharedProcessStartupPerformance,
  'Developer.sharedProcessMemoryUsage': Developer.sharedProcessMemoryUsage,
  'Developer.allocateMemory': Developer.allocateMemory,
  'Developer.crashSharedProcess': Developer.crashSharedProcess,
  'Developer.createHeapSnapshot': Developer.createHeapSnapshot,
  'Developer.createProfile': Developer.createProfile,
  'Developer.getNodeStartupTiming': Developer.getNodeStartupTiming,
  'Developer.getNodeStartupTime': Developer.getNodeStartupTiming,
}
