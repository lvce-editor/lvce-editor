import * as Performance from '../Performance/Performance.js'

export const getPerformanceEntries = () => {
  const entries = Performance.getEntries()
  const { timeOrigin } = Performance
  return {
    entries,
    timeOrigin,
  }
}

export const crashMainProcess = () => {
  throw new Error('oops')
}
