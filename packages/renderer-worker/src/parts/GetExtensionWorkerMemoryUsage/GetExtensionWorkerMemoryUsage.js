const dedicatedWorkerScope = 'DedicatedWorkerGlobalScope'

const getPathName = (url) => {
  if (typeof url !== 'string' || !url) {
    return ''
  }
  try {
    return new URL(url, 'http://localhost').pathname
  } catch {
    return ''
  }
}

const isMatchingAttribution = (attribution, workerPathName) => {
  return attribution?.scope === dedicatedWorkerScope && getPathName(attribution.url) === workerPathName
}

const isMatchingEntry = (entry, workerPathName) => {
  return Array.isArray(entry?.attribution) && entry.attribution.some((attribution) => isMatchingAttribution(attribution, workerPathName))
}

export const getExtensionWorkerMemoryUsage = (measurement, workerUrl) => {
  const workerPathName = getPathName(workerUrl)
  if (!workerPathName || !Array.isArray(measurement?.breakdown)) {
    return 0
  }
  let memoryUsage = 0
  for (const entry of measurement.breakdown) {
    if (Number.isFinite(entry?.bytes) && entry.bytes > 0 && isMatchingEntry(entry, workerPathName)) {
      memoryUsage += entry.bytes
    }
  }
  return memoryUsage
}
