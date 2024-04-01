import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.ts'

export const launchRendererWorker = async () => {
  const name = IsElectron.isElectron ? 'Renderer Worker (Electron)' : 'Renderer Worker'
  return LaunchWorker.launchWorker({
    name,
    url: RendererWorkerUrl.rendererWorkerUrl,
  })
}
