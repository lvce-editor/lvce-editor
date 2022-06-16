export const getMemoryInfo = () => {
  try {
    if (global.gc) {
      global.gc()
    }
  } catch {}
  const memoryUsage = process.memoryUsage()
  return {
    rss: memoryUsage.rss,
    heapUsed: memoryUsage.heapUsed,
    heapTotal: memoryUsage.heapTotal,
    external: memoryUsage.external,
  }
}
