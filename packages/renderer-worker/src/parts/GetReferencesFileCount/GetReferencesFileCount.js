import * as GetUniqueObjectCount from '../GetUniqueObjectCount/GetUniqueObjectCount.js'

export const getFileCount = (references) => {
  return GetUniqueObjectCount.getUniqueObjectCount(references, 'uri')
}
