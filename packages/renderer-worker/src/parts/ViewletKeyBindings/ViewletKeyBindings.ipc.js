import * as ViewletKeyBindings from './ViewletKeyBindings.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'KeyBindings.handleInput': Viewlet.wrapViewletCommand('KeyBindings', ViewletKeyBindings.handleInput),
  'KeyBindings.handleWheel': Viewlet.wrapViewletCommand('KeyBindings', ViewletKeyBindings.handleWheel),
}

export * from './ViewletKeyBindings.js'
