export const handleDropIndex = (state, index, files) => {
  const { dirents } = state
  const dirent = dirents[index]
  // TODO if it is a file, drop into the folder of the file
  // TODO if it is a folder, drop into the folder
  // TODO if it is a symlink, read symlink and determine if file can be dropped
  console.log({ dirent, files })
  globalThis.file = files[0]
  return state
}
