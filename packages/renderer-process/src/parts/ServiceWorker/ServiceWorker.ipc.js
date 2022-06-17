
import * as Command from '../Command/Command.js'
import * as ServiceWorker from './ServiceWorker.js'

export const __initialize__ = () => {
  Command.register(43725, ServiceWorker.register)
  Command.register(43726, ServiceWorker.uninstall)
}
