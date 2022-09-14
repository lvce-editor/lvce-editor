export const measureUserAgentSpecificMemory = async () => {
  // @ts-ignore
  if (performance && performance.measureUserAgentSpecificMemory) {
    // @ts-ignore
    const memory = await performance.measureUserAgentSpecificMemory()
    return memory
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
