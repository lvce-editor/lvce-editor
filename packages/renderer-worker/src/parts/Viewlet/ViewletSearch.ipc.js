import * as Command from '../Command/Command.js'
import * as ViewletSearch from './ViewletSearch.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(9444, Viewlet.wrapViewletCommand('Search', ViewletSearch.handleInput))
  Command.register(9445, Viewlet.wrapViewletCommand('Search', ViewletSearch.handleClick))
}
