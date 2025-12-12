import * as Icon from '../Icon/Icon.js'
import * as IconType from '../IconType/IconType.js'
import * as Id from '../Id/Id.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'
import * as ViewletQuickPickStrings from '../ViewletQuickPick/ViewletQuickPickStrings.js'

export const name = 'custom'

export const state = {
  args: [],
}

export const setArgs = (args) => {
  state.args = args
}

export const getPlaceholder = () => {
  return ''
}

export const getLabel = () => {
  return 'Custom'
}

// TODO help entries should not be here
export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return {
    label: ViewletQuickPickStrings.noMatchingResults(),
  }
}

export const getPicks = async (searchValue) => {
  const items = state.args[1] || []
  return items
}

export const selectPick = async (pick) => {
  const { args } = state
  await executeCallback2(args[2], pick)
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const getFilterValue = (value) => {
  return value
}

export const getPickFilterValue = (pick) => {
  return pick
}

export const getPickLabel = (pick) => {
  return pick.label
}

export const getPickDescription = (pick) => {
  return pick.description || ''
}

const convertIcon = (icon) => {
  switch (icon) {
    case IconType.SourceControl:
      return Icon.SourceControl
    case IconType.Cloud:
      return Icon.Cloud
    case IconType.Tag:
      return Icon.Tag
    default:
      return Icon.None
  }
}

export const getPickIcon = (pick) => {
  return convertIcon(pick.icon)
}

const callbackMap = Object.create(null)

export const registerCallback = () => {
  const { resolve, promise } = Promise.withResolvers()
  const callbackId = Id.create()
  callbackMap[callbackId] = resolve
  return {
    callbackId,
    promise,
  }
}

export const executeCallback2 = (callbackId, ...args) => {
  const fn = callbackMap[callbackId]
  delete callbackMap[callbackId]
  return fn(...args)
}
