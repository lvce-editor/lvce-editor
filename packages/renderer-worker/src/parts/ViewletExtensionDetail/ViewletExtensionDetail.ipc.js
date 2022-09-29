import * as ViewletExtensionDetail from './ViewletExtensionDetail.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'ExtensionDetail.handleIconError':  Viewlet.wrapViewletCommand('ExtensionDetail', ViewletExtensionDetail.handleIconError)
}

export * from './ViewletExtensionDetail.js'
