import * as Command from '../Command/Command.js'
import * as ServiceWorker from './ServiceWorker.js'

export const __initialize__ = () => {
  Command.register(5783, ServiceWorker.hydrate)
  Command.register(5784, ServiceWorker.uninstall)
}
