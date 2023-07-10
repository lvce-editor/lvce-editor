const { desktopCapturer } = require('electron')
const { VError } = require('../VError/VError.cjs')
const Assert = require('../Assert/Assert.cjs')

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

exports.getSources = async (options) => {
  try {
    Assert.object(options)
    const sources = await desktopCapturer.getSources(options)
    const serializedSources = serializeSources(sources)
    return serializedSources
  } catch (error) {
    throw new VError(error, `Failed to get desktop capturer sources`)
  }
}
