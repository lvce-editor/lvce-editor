import * as Performance from '../Performance/Performance.cjs'

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
