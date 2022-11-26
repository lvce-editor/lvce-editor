import * as Performance from './Performance.js'

export const name = 'Performance'

// prettier-ignore
export const Commands = {
  getMemory: Performance.getMemory,
  measureUserAgentSpecificMemory: Performance.measureUserAgentSpecificMemory,
}
