import * as ServiceWorker from './ServiceWorker.js'

export const Commands = {
  'ServiceWorker.hydrate': ServiceWorker.hydrate,
  'ServiceWorker.uninstall': ServiceWorker.uninstall,
}
