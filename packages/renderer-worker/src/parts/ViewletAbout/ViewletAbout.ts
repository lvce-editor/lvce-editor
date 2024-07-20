import * as AboutFocusId from '../AboutFocusId/AboutFocusId.js'
import * as Command from '../Command/Command.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetAboutDetailStringWeb from '../GetAboutDetailStringWeb/GetAboutDetailStringWeb.js'
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
  const lines = GetAboutDetailStringWeb.getDetailStringWeb()
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

const getNextFocus = (focusId: number) => {
  switch (focusId) {
    case AboutFocusId.Ok:
      return AboutFocusId.Copy
    case AboutFocusId.Copy:
      return AboutFocusId.Ok
    default:
      return AboutFocusId.None
  }
}

export const focusNext = (state: AboutState): AboutState => {
  const { focusId } = state
  return {
    ...state,
    focusId: getNextFocus(focusId),
  }
}

const getPreviousFocus = (focusId: number) => {
  switch (focusId) {
    case AboutFocusId.Ok:
      return AboutFocusId.Copy
    case AboutFocusId.Copy:
      return AboutFocusId.Ok
    default:
      return AboutFocusId.None
  }
}

export const focusPrevious = (state: AboutState): AboutState => {
  const { focusId } = state
  return {
    ...state,
    focusId: getPreviousFocus(focusId),
  }
}
