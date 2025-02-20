import * as Json from '../Json/Json.js'
import * as MapObject from '../MapObject/MapObject.js'

export const serializeObjects = async (objects) => {
  const serializedObjects = MapObject.mapObject(objects, Json.stringifyCompact)
  return serializedObjects
}
