import * as Command from '../Command/Command.js'
import * as ServiceWorker from './ServiceWorker.js'

export const __initialize__ = () => {
  Command.register('ServiceWorker.hydrate', ServiceWorker.hydrate)
  Command.register('ServiceWorker.uninstall', ServiceWorker.uninstall)
}
