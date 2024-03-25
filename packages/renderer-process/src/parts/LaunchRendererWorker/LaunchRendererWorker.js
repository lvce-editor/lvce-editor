import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.js'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.js'

export const launchRendererWorker = async () => {
  const name = IsElectron.isElectron ? 'Renderer Worker (Electron)' : 'Renderer Worker'
  return LaunchWorker.launchWorker({
    name,
    url: RendererWorkerUrl.rendererWorkerUrl,
  })
}
