import * as Command from '../Command/Command.js'
import * as ServiceWorker from './ServiceWorker.js'
import * as CommandId from '../CommandId/CommandId.js'

export const __initialize__ = () => {
  Command.register(CommandId.SERVICE_WORKER_REGISTER, ServiceWorker.register)
  Command.register(CommandId.SERVICE_WORKER_UNINSTALL, ServiceWorker.uninstall)
}
