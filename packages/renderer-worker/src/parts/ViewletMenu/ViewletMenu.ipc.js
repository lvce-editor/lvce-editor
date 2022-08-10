import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMenu from './ViewletMenu.js'

// prettier-ignore
export const Commands = {
  'Menu.handleMouseEnter': Viewlet.wrapViewletCommand('Menu', ViewletMenu.handleMouseEnter),
}

export * from './ViewletMenu.js'
