import { desktopCapturer } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as SerializeDesktopCapturerSources from '../SerializeDesktopCapturerSources/SerializeDesktopCapturerSources.js'
import { VError } from '../VError/VError.js'

export const getSources = async (options) => {
  try {
    Assert.object(options)
    const sources = await desktopCapturer.getSources(options)
    const serializedSources = SerializeDesktopCapturerSources.serializeDeskopCapturerSources(sources)
    return serializedSources
  } catch (error) {
    throw new VError(error, `Failed to get desktop capturer sources`)
  }
}
