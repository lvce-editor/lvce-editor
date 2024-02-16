import * as Icon from '../Icon/Icon.js'
import * as IconType from '../IconType/IconType.js'
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
  const resolve = args[2]
  resolve(pick)
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
