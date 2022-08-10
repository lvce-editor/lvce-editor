import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMenu from './ViewletMenu.js'

// prettier-ignore
export const Commands = {
  'Menu.handleMouseOver': Viewlet.wrapViewletCommand('Menu', ViewletMenu.handleMouseOver),
  'Menu.handleMouseOut': Viewlet.wrapViewletCommand('Menu', ViewletMenu.handleMouseOut),
}

export * from './ViewletMenu.js'
