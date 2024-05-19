import * as Command from '../Command/Command.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = () => {
  return {
    okCommand: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    okCommand: '',
  }
}

export const handleClickCancel = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.Confirm)
  return state
}

export const handleClickOk = async (state) => {
  const { okCommand } = state
  await Command.execute(okCommand)
  return state
}

export const handleClickClose = async (state) => {
  await Viewlet.closeWidget(ViewletModuleId.Confirm)
  return state
}

export const handleFocusIn = (state) => {
  Focus.setFocus(FocusKey.Confirm)
  return state
}
