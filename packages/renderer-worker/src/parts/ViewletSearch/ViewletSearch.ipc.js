import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  'ViewletSearch.handleInput': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleInput),
  'ViewletSearch.handleClick': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleClick),
}

export const Css = '/css/parts/ViewletSearch.css'

export * from './ViewletSearch.js'
