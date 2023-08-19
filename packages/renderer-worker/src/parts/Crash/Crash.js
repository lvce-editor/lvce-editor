import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const crashSharedProcess = () => {
  return SharedProcess.invoke('Crash.crashSharedProcess')
}

export const crashMainProcess = () => {
  return SharedProcess.invoke('Crash.crashMainProcess')
}

export const crashRendererProcess = () => {}

export const crashRendererWorker = () => {}
