import * as ElectronContentTracing from '../ElectronContentTracing/ElectronContentTracing.js'
import * as PathToFileUri from '../PathToFileUri/PathToFileUri.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Command from '../Command/Command.js'

let isRecording = false

export const start = async () => {
  if (Platform.getPlatform() !== PlatformType.Electron) {
    throw new Error('content tracing is only supported in electron')
  }
  if (isRecording) {
    return
  }
  await ElectronContentTracing.startRecording({
    included_categories: ['devtools.timeline', 'v8', 'blink.user_timing'],
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
  await Command.execute('Main.openInput', {
    editorInput: { type: 'webview', uri: PathToFileUri.pathToFileUri(path), providerId: 'builtin.performance-profile-view' },
    focus: true,
    args: [{ opener: 'builtin.performance-profile-view' }],
  })
}
