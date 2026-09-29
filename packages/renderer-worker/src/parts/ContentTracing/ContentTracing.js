import * as ElectronContentTracing from '../ElectronContentTracing/ElectronContentTracing.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as OpenUri from '../OpenUri/OpenUri.js'

let isRecording = false

export const start = async () => {
  if (Platform.getPlatform() !== PlatformType.Electron) {
    throw new Error('content tracing is only supported in electron')
  }
  if (isRecording) {
    return
  }
  await ElectronContentTracing.startRecording({
    included_categories: ['*'],
  })
  isRecording = true
}

export const stop = async () => {
  if (Platform.getPlatform() !== PlatformType.Electron) {
    throw new Error('content tracing is only supported in electron')
  }
  if (!isRecording) {
    throw new Error('content tracing is not recording')
  }
  const path = await ElectronContentTracing.stopRecording()
  isRecording = false
  await OpenUri.openUri(path, true, { opener: 'builtin.performance-profile-view' })
}
