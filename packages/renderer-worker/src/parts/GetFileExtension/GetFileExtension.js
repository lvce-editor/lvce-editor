import * as Character from '../Character/Character.js'
import * as Assert from '../Assert/Assert.js'

export const getFileExtensionIndex = (file) => {
  Assert.string(file)
  return file.lastIndexOf(Character.Dot)
}

export const getFileExtension = (file) => {
  const index = getFileExtensionIndex(file)
  return file.slice(index)
}

export const getNthFileExtension = (file, startIndex) => {
  return file.lastIndexOf(Character.Dot, startIndex)
}
