import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletMenu from './ViewletMenu.js'

// prettier-ignore
export const Commands = {
  'Menu.handleMouseOver': Viewlet.wrapViewletCommand('Menu', ViewletMenu.handleMouseOver),
}

export * from './ViewletMenu.js'
