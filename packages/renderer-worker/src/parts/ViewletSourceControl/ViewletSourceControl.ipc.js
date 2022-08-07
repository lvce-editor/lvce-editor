import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSourceControl from './ViewletSourceControl.js'

// prettier-ignore
export const Commands = {
  '6532': Viewlet.wrapViewletCommand('Source Control',ViewletSourceControl.acceptInput)
}

export const Css = ['/css/parts/ViewletSourceControl.css']

export * from './ViewletSourceControl.js'
