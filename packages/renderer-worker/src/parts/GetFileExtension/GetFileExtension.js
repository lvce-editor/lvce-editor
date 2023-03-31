import * as Character from '../Character/Character.js'

export const getFileExtensionIndex = (file) => {
  return file.lastIndexOf(Character.Dot)
}

export const getFileExtension = (file) => {
  const index = getFileExtensionIndex(file)
  return file.slice(index)
}

export const getNthFileExtension = (file, startIndex) => {
  return file.lastIndexOf(Character.Dot, startIndex)
}
