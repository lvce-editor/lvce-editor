import * as Command from '../Command/Command.js'
import * as Window from './Window.js'

export const __initialize__ = () => {
  Command.register(8080, Window.reload)
  Command.register(8081, Window.minimize)
  Command.register(8082, Window.maximize)
  Command.register(8083, Window.unmaximize)
  Command.register(8084, Window.close)
  Command.register(8085, Window.setTitle)
}
