import { VError } from '../VError/VError.js'

export const start = async () => {
  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {},
    })
    console.log({ captureStream })
  } catch (error) {
    throw new VError(error, `Failed to start screen capture`)
  }
}
