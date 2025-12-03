import * as DesktopCapturer from '../DesktopCapturer/DesktopCapturer.js'
import * as MediaDevices from '../MediaDevices/MediaDevices.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const createScreenCaptureStream = async (captureId) => {
  if (Platform.getPlatform() === PlatformType.Electron) {
    const sources = await DesktopCapturer.getSources({
      types: ['screen'],
    })
    const source = sources[0]
    const sourceId = source.id
    await MediaDevices.getUserMedia(captureId, {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    })
    return
  }
  await MediaDevices.getUserMedia(captureId, {
    audio: false,
    video: true,
  })
}
