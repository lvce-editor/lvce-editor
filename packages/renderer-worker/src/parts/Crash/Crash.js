import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const crashSharedProcess = () => {
  return SharedProcess.invoke(/* Developer.crashSharedProcess */ 'Developer.crashSharedProcess')
}

export const crashMainProcess = () => {
  return SharedProcess.invoke(/* Electron.crashMainProcess */ 'Electron.crashMainProcess')
}

export const crashRendererProcess = () => {}

export const crashRendererWorker = () => {}
