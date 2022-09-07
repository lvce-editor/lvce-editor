import * as ServiceWorker from './ServiceWorker.js'

export const COmmands = {
  'ServiceWorker.register': ServiceWorker.register,
  'ServiceWorker.uninstall': ServiceWorker.uninstall,
}
