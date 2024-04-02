import * as Arrays from '../Arrays/Arrays.js'

const compareExtension = (extensionA, extensionB) => {
  return extensionA.name.localeCompare(extensionB.name) || extensionA.id.localeCompare(extensionB.id)
}

export const sortExtensions = (extensions) => {
  return Arrays.toSorted(extensions, compareExtension)
}
