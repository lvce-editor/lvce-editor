import * as Command from '../Command/Command.js'

export const readFile = () => {
  return Command.execute('Developer.getMemoryUsageContent')
}

export const writeFile = () => {
  throw new Error('not implemened')
}
