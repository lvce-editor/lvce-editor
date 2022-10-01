import * as ViewletKeyBindings from './ViewletKeyBindings.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'KeyBindings.handleInput': Viewlet.wrapViewletCommand(ViewletKeyBindings.name, ViewletKeyBindings.handleInput),
  'KeyBindings.handleWheel': Viewlet.wrapViewletCommand(ViewletKeyBindings.name, ViewletKeyBindings.handleWheel),
}

export * from './ViewletKeyBindings.js'
