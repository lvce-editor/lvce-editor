import * as ViewletKeyBindings from './ViewletKeyBindings.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'KeyBindings.handleInput': Viewlet.wrapViewletCommand('KeyBindings', ViewletKeyBindings.handleInput),
}

export * from './ViewletKeyBindings.js'
