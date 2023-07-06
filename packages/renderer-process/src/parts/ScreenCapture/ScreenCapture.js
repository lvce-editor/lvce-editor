import { VError } from '../VError/VError.js'

export const start = async (options) => {
  try {
    const captureStream = await navigator.mediaDevices.getUserMedia(options)
    console.log({ captureStream })
    const videoTracks = captureStream.getVideoTracks()
    // const track = videoTracks[0]
    // console.log({ track })
    // return track.clone()
  } catch (error) {
    throw new VError(error, `Failed to start screen capture`)
  }
}
