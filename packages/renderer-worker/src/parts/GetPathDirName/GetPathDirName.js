export const getPathDirName = (path) => {
  const slashIndex = path.lastIndexOf('/')
  const backslashIndex = path.lastIndexOf('\\')
  const index = Math.max(slashIndex, backslashIndex)
  if (index === -1) {
    return ''
  }
  return path.slice(0, index)
}
