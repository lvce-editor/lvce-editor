import * as ViewletPanel from '../ViewletPanel/ViewletPanel.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'Panel.selectIndex': Viewlet.wrapViewletCommand('Panel', ViewletPanel.selectIndex)
}

export * from './ViewletPanel.js'
