import * as AboutFocusId from '../AboutFocusId/AboutFocusId.js'
import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as Command from '../Command/Command.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Product from '../Product/Product.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import type { AboutState } from './ViewletAboutTypes.ts'

export const create = (): AboutState => {
  return {
    productName: '',
    lines: [],
    focusId: AboutFocusId.None,
  }
}

export const loadContent = async (state: AboutState): Promise<AboutState> => {
  const lines = await AboutViewWorker.invoke('About.getDetailStringWeb')
  console.log({ lines })
  return {
    ...state,
    productName: Product.productNameLong,
    lines,
    focusId: AboutFocusId.Ok,
  }
}

export const handleClickOk = async (state: AboutState): Promise<AboutState> => {
  await Viewlet.closeWidget(ViewletModuleId.About)
  return state
}

export const handleClickCopy = async (state: AboutState): Promise<AboutState> => {
  const { lines } = state
  const message = JoinLines.joinLines(lines)
  await Command.execute('ClipBoard.writeText', message)
  return state
}

export const handleClickClose = async (state: AboutState): Promise<AboutState> => {
  await Viewlet.closeWidget(ViewletModuleId.About)
  return state
}

export const handleFocusIn = (state: AboutState): AboutState => {
  Focus.setFocus(FocusKey.About)
  return state
}

export const focusNext = (state: AboutState): Promise<AboutState> => {
  return AboutViewWorker.invoke('About.focusNext', state)
}

export const focusPrevious = (state: AboutState): Promise<AboutState> => {
  return AboutViewWorker.invoke('About.focusPrevious', state)
}
