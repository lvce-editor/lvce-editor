export const handleLoadedMetaData = (event) => {
  // TODO should send event to renderer worker, renderer worker should invoke play method
  const { target } = event
  target.play()
}
