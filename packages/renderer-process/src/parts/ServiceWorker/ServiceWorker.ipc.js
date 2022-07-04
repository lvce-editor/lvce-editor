import * as Command from '../Command/Command.js'
import * as ServiceWorker from './ServiceWorker.js'

export const __initialize__ = () => {
  Command.register('ServiceWorker.register', ServiceWorker.register)
  Command.register('ServiceWorker.uninstall', ServiceWorker.uninstall)
}
