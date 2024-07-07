import * as AboutFocusId from '../AboutFocusId/AboutFocusId.js'
import * as ClipBoard from '../ClipBoard/ClipBoard.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetAboutDetailStringWeb from '../GetAboutDetailStringWeb/GetAboutDetailStringWeb.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Product from '../Product/Product.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = () => {
  return {
    productName: '',
    lines: [],
    focusId: AboutFocusId.None,
  }
}

export const loadContent = async (state) => {
  const lines = GetAboutDetailStringWeb.getDetailStringWeb()
  return {
    ...state,
    productName: Product.productNameLong,
    lines,
    focusId: AboutFocusId.Ok,
  }
}

export const handleClickOk = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.About)
  return state
}

export const handleClickCopy = async (state) => {
  const { lines } = state
  const message = JoinLines.joinLines(lines)
  await ClipBoard.writeText(message)
  return state
}

export const handleClickClose = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.About)
  return state
}

export const handleFocusIn = (state) => {
  Focus.setFocus(FocusKey.About)
  return state
}

const getNextFocus = (focusId) => {
  switch (focusId) {
    case AboutFocusId.Ok:
      return AboutFocusId.Copy
    case AboutFocusId.Copy:
      return AboutFocusId.Ok
    default:
      return AboutFocusId.None
  }
}

export const focusNext = (state) => {
  const { focusId } = state
  return {
    ...state,
    focusId: getNextFocus(focusId),
  }
}

const getPreviousFocus = (focusId) => {
  switch (focusId) {
    case AboutFocusId.Ok:
      return AboutFocusId.Copy
    case AboutFocusId.Copy:
      return AboutFocusId.Ok
    default:
      return AboutFocusId.None
  }
}

export const focusPrevious = (state) => {
  const { focusId } = state
  return {
    ...state,
    focusId: getPreviousFocus(focusId),
  }
}
