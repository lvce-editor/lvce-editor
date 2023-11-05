import { desktopCapturer } from 'electron'
import { VError } from '../VError/VError.js'
import * as Assert from '../Assert/Assert.js'

const serializeSource = (source) => {
  return {
    display_id: source.display_id,
    id: source.id,
    name: source.name,
  }
}

const serializeSources = (sources) => {
  return sources.map(serializeSource)
}

export const getSources = async (options) => {
  try {
    Assert.object(options)
    const sources = await desktopCapturer.getSources(options)
    const serializedSources = serializeSources(sources)
    return serializedSources
  } catch (error) {
    throw new VError(error, `Failed to get desktop capturer sources`)
  }
}
