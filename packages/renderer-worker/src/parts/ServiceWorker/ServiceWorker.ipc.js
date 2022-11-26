import * as ServiceWorker from './ServiceWorker.js'

export const name = 'ServiceWorker'

export const Commands = {
  hydrate: ServiceWorker.hydrate,
  uninstall: ServiceWorker.uninstall,
}
