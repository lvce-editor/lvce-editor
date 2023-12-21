import * as FileSystem from '../FileSystem/FileSystem.js'

export const getDiffEditorContents = async (left, right) => {
  const [contentLeft, contentRight] = await Promise.all([FileSystem.readFile(left), FileSystem.readFile(right)])
  return {
    contentLeft,
    contentRight,
  }
}
