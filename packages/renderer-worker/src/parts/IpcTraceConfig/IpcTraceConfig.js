const traceIpcFlag = '--trace-ipc'
const traceIpcPrefix = `${traceIpcFlag}=`

export const parseTraceIpc = (argv) => {
  let value
  for (let index = 1; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === traceIpcFlag) {
      const nextArgument = argv[index + 1]
      value = typeof nextArgument === 'string' && !nextArgument.startsWith('--') ? nextArgument : ''
      break
    }
    if (typeof argument === 'string' && argument.startsWith(traceIpcPrefix)) {
      value = argument.slice(traceIpcPrefix.length)
      break
    }
  }
  if (value === undefined) {
    return { error: '', selectors: new Set() }
  }
  const selectors = new Set(
    value
      .split(',')
      .map((selector) => selector.trim())
      .filter(Boolean),
  )
  if (selectors.size === 0) {
    return {
      error: '--trace-ipc requires a comma-separated worker id list or *',
      selectors,
    }
  }
  return { error: '', selectors }
}

export const shouldTrace = (selectors, traceId) => {
  return selectors.has('*') || Boolean(traceId && selectors.has(traceId))
}
