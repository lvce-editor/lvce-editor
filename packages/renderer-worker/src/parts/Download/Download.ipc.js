import * as Command from '../Command/Command.js'
import * as Download from './Download.js'

export const __initialize__ = () => {
  Command.register('Download.downloadFile', Download.downloadFile)
}
