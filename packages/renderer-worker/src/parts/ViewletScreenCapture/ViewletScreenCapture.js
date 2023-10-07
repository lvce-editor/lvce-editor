import * as DesktopCapturer from '../DesktopCapturer/DesktopCapturer.js'
import * as Id from '../Id/Id.js'
import * as MediaDevices from '../MediaDevices/MediaDevices.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const create = (id, uri) => {
  return {
    id,
    uid: id,
    message: '',
    captureId: 0,
  }
}

export const loadContent = async (state) => {
  const captureId = Id.create()
  if (Platform.platform === PlatformType.Electron) {
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
  } else {
    await MediaDevices.getUserMedia(captureId, {
      audio: false,
      video: true,
    })
  }
  return {
    ...state,
    captureId,
  }
}

export const dispose = async (state) => {
  // TODO race condition
  const { captureId } = state
  await MediaDevices.dispose(captureId)
}
