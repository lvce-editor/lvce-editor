import * as SerializeDesktopCapturerSource from '../SerializeDesktopCapturerSource/SerializeDesktopCapturerSource.js'

export const serializeDeskopCapturerSources = (sources) => {
  return sources.map(SerializeDesktopCapturerSource.serializeDeskopCapturerSource)
}
