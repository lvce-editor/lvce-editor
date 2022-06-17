import * as Command from '../Command/Command.js'
import * as Search from './Search.js'

export const __initialize__ = () => {
  Command.register('Search.search', Search.search)
}
