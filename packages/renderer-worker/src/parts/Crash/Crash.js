import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const createSharedProcessHeapSnapshot = async () => {
  await SharedProcess.invoke(/* Developer.createSharedProcessHeapSnapshot */ 'Developer.createSharedProcessHeapSnapshot')
}

export const createSharedProcessProfile = async () => {
  await SharedProcess.invoke(/* Developer.createProfile */ 'Developer.createProfile')
}

export const crashRendererProcess = () => {}

export const crashRendererWorker = () => {}
