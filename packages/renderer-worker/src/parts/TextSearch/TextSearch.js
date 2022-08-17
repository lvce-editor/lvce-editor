import * as Assert from '../Assert/Assert.js'

const getProvider = (scheme) => {
  switch (scheme) {
    case 'file':
      return import('./TextSearchNode.js')
    default:
      return import('./TextSearchExtension.js')
  }
}

const getScheme = (root) => {
  const colonSlashSlashIndex = root.indexOf('://')
  if (colonSlashSlashIndex === -1) {
    return 'file'
  }
  return root.slice(0, colonSlashSlashIndex)
}

export const textSearch = async (root, query) => {
  Assert.string(root)
  Assert.string(query)
  const scheme = getScheme(root)
  const provider = await getProvider(scheme)
  const results = await provider.textSearch(scheme, root, query)
  return results
}
