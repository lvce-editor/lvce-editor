import * as IsElectronUserAgentSpecificMemoryError from '../IsElectronUserAgentSpecificMemoryError/IsElectronUserAgentSpecificMemoryError.ts'

export const measureUserAgentSpecificMemory = async () => {
  try {
    // @ts-ignore
    if (performance && performance.measureUserAgentSpecificMemory) {
      // @ts-ignore
      const memory = await performance.measureUserAgentSpecificMemory()
      return memory
    }
  } catch (error) {
    if (IsElectronUserAgentSpecificMemoryError.isElectronUserAgentSpecificMemoryError(error)) {
      return undefined
    }
    throw error
  }
  return undefined
}

export const getMemory = () => {
  // @ts-ignore
  const memory = performance.memory
  if (!memory) {
    return undefined
  }
  return {
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize,
  }
}
