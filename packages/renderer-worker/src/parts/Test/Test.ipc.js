import * as Command from '../Command/Command.js'
import * as Test from './Test.js'

export const __initialize__ = () => {
  Command.register('Test.execute', Test.execute)
}
