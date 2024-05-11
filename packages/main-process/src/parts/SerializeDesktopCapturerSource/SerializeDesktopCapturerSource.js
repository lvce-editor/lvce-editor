export const serializeDeskopCapturerSource = (source) => {
  return {
    display_id: source.display_id,
    id: source.id,
    name: source.name,
  }
}
