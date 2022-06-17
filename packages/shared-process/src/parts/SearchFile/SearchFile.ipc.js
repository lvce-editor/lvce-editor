import * as Command from '../Command/Command.js'
import * as SearchFile from './SearchFile.js'

export const __initialize__ = () => {
  Command.register('SearchFile.searchFile', SearchFile.searchFile)
}
