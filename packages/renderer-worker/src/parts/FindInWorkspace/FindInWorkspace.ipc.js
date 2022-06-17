import * as Command from '../Command/Command.js'
import * as FindInWorkspace from './FindInWorkspace.js'

export const __initialize__ = () => {
  Command.register(5200, FindInWorkspace.findInWorkspace)
  console.log('register command')
  console.log(Command.state.commands)
}
