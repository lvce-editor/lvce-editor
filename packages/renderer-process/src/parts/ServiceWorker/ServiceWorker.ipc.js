import * as ServiceWorker from './ServiceWorker.js'

export const Commands = {
  'ServiceWorker.register': ServiceWorker.register,
  'ServiceWorker.uninstall': ServiceWorker.uninstall,
}
