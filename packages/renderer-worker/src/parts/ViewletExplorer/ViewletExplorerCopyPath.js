export const copyPath = async (state) => {
  const dirent = getFocusedDirent(state)
  // TODO windows paths
  // TODO handle error
  const path = dirent.path
  await Command.execute(/* ClipBoard.writeText */ 241, /* text */ path)
}
