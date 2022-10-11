import * as Viewlet from '../Viewlet/Viewlet.js'
import * as SimpleBrowser from './ViewletSimpleBrowser.js'

// prettier-ignore
export const Commands = {
  'SimpleBrowser.openDevtools': Viewlet.wrapViewletCommand('SimpleBrowser', SimpleBrowser.openDevtools)
}

export * from './ViewletSimpleBrowser.js'
