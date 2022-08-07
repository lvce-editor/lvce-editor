import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  'ViewletSearch.handleInput': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleInput),
  'ViewletSearch.handleClick': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleClick),
}

export * from './ViewletSearch.js'
