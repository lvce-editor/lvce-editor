import * as Performance from './Performance.ts'

export const name = 'Performance'

// prettier-ignore
export const Commands = {
  getMemory: Performance.getMemory,
  measureUserAgentSpecificMemory: Performance.measureUserAgentSpecificMemory,
}
