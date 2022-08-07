import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletProblems from './ViewletProblems.js'

// prettier-ignore
export const Commands = {
  'ViewletProblems.focusIndex': Viewlet.wrapViewletCommand('Problems', ViewletProblems.focusIndex),
}

export * from './ViewletProblems.js'
