import * as DirentType from '../DirentType/DirentType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as LocationType from '../LocationType/LocationType.js'

const getName = (uri) => {
  if (!uri) {
    return ''
  }
  return uri.slice(uri.lastIndexOf('/') + 1)
}

export const getDisplayReferences = (references) => {
  const displayReferences = []
  let currentUri = ''
  let outerPosInSet = 1
  let innerPosInSet = 1
  let fileCount = 0
  let index = 0
  for (const reference of references) {
    if (reference.uri === currentUri) {
      displayReferences.push({
        depth: 2,
        posInSet: innerPosInSet++,
        setSize: 1,
        type: LocationType.Leaf,
        uri: '',
        name: '',
        lineText: reference.lineText || '',
        icon: '',
        index: index++,
        startOffset: reference.startColumnIndex || reference.startOffset,
        endOffset: reference.endColumnIndex || reference.endOffset,
      })
    } else {
      fileCount++
      currentUri = reference.uri
      innerPosInSet = 1
      const name = getName(reference.uri)
      displayReferences.push({
        depth: 1,
        posInSet: outerPosInSet++,
        setSize: 1,
        type: LocationType.Expanded,
        uri: reference.uri,
        name,
        lineText: '',
        icon: IconTheme.getIcon({
          type: DirentType.File,
          path: reference.uri,
          name,
        }),
        index: index++,
        startOffset: 0,
        endOffset: 0,
      })
      displayReferences.push({
        depth: 2,
        posInSet: innerPosInSet++,
        setSize: 1,
        type: LocationType.Leaf,
        uri: '',
        name: '',
        lineText: reference.lineText || '',
        icon: '',
        index: index++,
        startOffset: reference.startColumnIndex || reference.startOffset,
        endOffset: reference.endColumnIndex || reference.endOffset,
      })
    }
  }
  console.log({ references })
  return displayReferences
}
