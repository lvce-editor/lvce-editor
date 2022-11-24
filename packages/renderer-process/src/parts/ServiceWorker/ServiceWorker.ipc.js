import * as ServiceWorker from './ServiceWorker.js'

export const name = 'ServiceWorker'

export const Commands = {
  register: ServiceWorker.register,
  uninstall: ServiceWorker.uninstall,
}
