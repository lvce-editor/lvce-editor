import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Arrays from '../Arrays/Arrays.js'

const compareExtension = (a, b) => {
  return a.name.localeCompare(b.name)
}

const sortBuiltinExtensions = (builtinExtensions) => {
  return Arrays.sort(builtinExtensions, compareExtension)
}

export const formatBuiltinExtensions = async () => {
  const builtinExtensions = await JsonFile.readJson('packages/build/src/parts/DownloadBuiltinExtensions/builtinExtensions.json')
  const sortedBuiltinExtensions = sortBuiltinExtensions(builtinExtensions)
  if (Arrays.isEqual(builtinExtensions, sortedBuiltinExtensions)) {
    return
  }
  await JsonFile.writeJson({
    to: 'packages/build/src/parts/DownloadBuiltinExtensions/builtinExtensions.json',
    value: sortedBuiltinExtensions,
  })
}
