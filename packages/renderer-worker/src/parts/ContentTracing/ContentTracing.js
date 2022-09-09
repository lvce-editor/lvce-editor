import * as ElectronContentTracing from '../ElectronContentTracing/ElectronContentTracing.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const start = async () => {
  if (Platform.platform !== PlatformType.Electron) {
    throw new Error('content tracing is only supported in electron')
  }
  await ElectronContentTracing.startRecording({
    included_categories: ['*'],
  })
}

export const stop = async () => {
  if (Platform.platform !== PlatformType.Electron) {
    throw new Error('content tracing is only supported in electron')
  }
  const path = await ElectronContentTracing.stopRecording()
  console.log({ path })
}
