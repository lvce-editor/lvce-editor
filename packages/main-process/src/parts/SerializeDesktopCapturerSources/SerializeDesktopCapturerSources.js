const serializeSource = (source) => {
  return {
    display_id: source.display_id,
    id: source.id,
    name: source.name,
  }
}

export const serializeDeskopCapturerSources = (sources) => {
  return sources.map(serializeSource)
}
