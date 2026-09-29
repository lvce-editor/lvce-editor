export const getNodeStartupTiming = (): any => {
  const {
    bootstrapComplete,
    duration,
    entryType,
    environment,
    idleTime,
    loopExit,
    loopStart,
    name,
    // @ts-ignore
    nodeStart,
    startTime,
    v8Start,
  } = performance.nodeTiming
  return {
    bootstrapComplete,
    duration,
    entryType,
    environment,
    idleTime,
    loopExit,
    loopStart,
    name,
    nodeStart,
    startTime,
    v8Start,
  }
}
