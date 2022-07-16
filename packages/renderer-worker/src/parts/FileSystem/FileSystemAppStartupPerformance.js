import * as Command from '../Command/Command.js'

export const readFile = () => {
  return Command.execute(
    /* Developer.getStartupPerformanceContent */ 'Developer.getStartupPerformanceContent'
  )
}

export const writeFile = () => {
  throw new Error('not implemented')
}
