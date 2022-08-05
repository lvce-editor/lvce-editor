import * as Viewlet from './Viewlet.js'
import * as ViewletSourceControl from './ViewletSourceControl.js'

// prettier-ignore
export const Commands = {
  '6532': Viewlet.wrapViewletCommand('Source Control',ViewletSourceControl.acceptInput)
}

export * from './ViewletSourceControl.js'
