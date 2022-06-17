import * as Command from '../Command/Command.js'
import * as Blob from './Blob.js'

export const __initialize__ = () => {
  Command.register(4356, Blob.base64StringToBlob)
}
