import * as ViewletStatusBar from './ViewletStatusBar.js'

export const name = 'StatusBar'

// prettier-ignore
export const Commands = {
  'ViewletStatusBar.updateStatusBarItems': ViewletStatusBar.updateStatusBarItems
}

export const Css = '/css/parts/ViewletStatusBar.css'

export * from './ViewletStatusBar.js'
