import * as Json from '../Json/Json.js'
import * as MapObject from '../MapObject/MapObject.js'

export const serializeObjects = (objects) => {
  const serializedObjects = MapObject.mapObject(objects, Json.stringifyCompact)
  return serializedObjects
}
