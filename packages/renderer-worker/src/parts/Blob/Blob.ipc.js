import * as Command from '../Command/Command.js'
import * as Blob from './Blob.js'

export const __initialize__ = () => {
  Command.register('Blob.base64StringToBlob', Blob.base64StringToBlob)
}
