import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletProblems from './ViewletProblems.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register(7550, Viewlet.wrapViewletCommand('Problems', ViewletProblems.focusIndex))
}
