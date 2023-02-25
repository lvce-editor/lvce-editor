import * as ViewletPanel from '../ViewletPanel/ViewletPanel.js'

export const name = 'Panel'

// prettier-ignore
export const Commands = {
  selectIndex: ViewletPanel.selectIndex
}

export const Css = ['/css/parts/ViewletPanel.css', '/css/parts/IconButton.css', '/css/parts/Actions.css']

export * from './ViewletPanel.js'
