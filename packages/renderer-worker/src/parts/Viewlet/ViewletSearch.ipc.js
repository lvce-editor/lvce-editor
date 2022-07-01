import * as Command from '../Command/Command.js'
import * as ViewletSearch from './ViewletSearch.js'
import * as Viewlet from './Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ViewletSearch.handleInput', Viewlet.wrapViewletCommand('Search', ViewletSearch.handleInput))
  Command.register('ViewletSearch.handleClick', Viewlet.wrapViewletCommand('Search', ViewletSearch.handleClick))
}
