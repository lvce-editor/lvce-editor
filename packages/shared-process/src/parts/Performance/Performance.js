export const getNodeStartupTiming = () => {
  const {
    name,
    entryType,
    startTime,
    duration,
    // @ts-ignore
    nodeStart,
    v8Start,
    bootstrapComplete,
    environment,
    loopStart,
    loopExit,
    idleTime,
  } = performance.nodeTiming
  return {
    name,
    entryType,
    startTime,
    duration,
    nodeStart,
    v8Start,
    bootstrapComplete,
    environment,
    loopStart,
    loopExit,
    idleTime,
  }
}
