import * as Command from '../Command/Command.js'
import * as FindInWorkspace from './FindInWorkspace.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('FindInWorkspace.findInWorkspace', FindInWorkspace.findInWorkspace)
}
