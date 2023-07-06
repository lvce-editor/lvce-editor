import * as DesktopCapturer from '../DesktopCapturer/DesktopCapturer.js'
import * as MediaDevices from '../MediaDevices/MediaDevices.js'
import * as Platform from '../Platform/Platform.js'

export const create = () => {
  return {
    message: '',
  }
}

export const loadContent = async (state) => {
  if (Platform.platform === 'electron') {
    const sources = await DesktopCapturer.getSources({
      types: ['screen'],
    })
    const source = sources[0]
    const sourceId = source.id
    await MediaDevices.getUserMedia({
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
    await MediaDevices.getUserMedia({
      audio: false,
      video: true,
    })
  }
  return {
    message: 'screen cast',
  }
}
