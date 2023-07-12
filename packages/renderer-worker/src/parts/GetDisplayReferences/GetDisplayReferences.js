import * as DirentType from '../DirentType/DirentType.js'
import * as IconTheme from '../IconTheme/IconTheme.js'

const getName = (uri) => {
  return uri.slice(uri.lastIndexOf('/') + 1)
}

export const getDisplayReferences = (references) => {
  const displayReferences = []
  let current = {
    uri: '',
    startOffset: 0,
    endOffset: 0,
    lineText: '',
  }
  let outerPosInSet = 1
  let innerPosInSet = 1
  let fileCount = 0
  let index = 0
  for (const reference of references) {
    if (reference.uri === current.uri) {
      displayReferences.push({
        depth: 2,
        posInSet: innerPosInSet++,
        setSize: 1,
        type: 'leaf',
        uri: '',
        name: '',
        lineText: reference.lineText,
        index: index++,
      })
    } else {
      fileCount++
      current = reference
      innerPosInSet = 1
      const name = getName(reference.uri)
      displayReferences.push({
        depth: 1,
        posInSet: outerPosInSet++,
        setSize: 1,
        type: 'expanded',
        uri: reference.uri,
        name,
        lineText: '',
        icon: IconTheme.getIcon({
          type: DirentType.File,
          path: reference.uri,
          name,
        }),
        index: index++,
      })
      displayReferences.push({
        depth: 2,
        posInSet: innerPosInSet++,
        setSize: 1,
        type: 'leaf',
        uri: '',
        name: '',
        lineText: current.lineText,
        index: index++,
      })
    }
  }
  return displayReferences
}
