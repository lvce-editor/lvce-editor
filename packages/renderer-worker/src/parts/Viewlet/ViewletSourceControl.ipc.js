import * as Command from '../Command/Command.js'
import * as ViewletSourceControl from './ViewletSourceControl.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(6532, Viewlet.wrapViewletCommand('Source Control',ViewletSourceControl.acceptInput))
}
