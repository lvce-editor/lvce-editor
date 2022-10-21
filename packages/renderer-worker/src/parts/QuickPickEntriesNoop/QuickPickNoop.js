import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NoResults: 'No Results',
}

export const name = 'noop'

export const getPlaceholder = () => {
  return ''
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return UiStrings.NoResults
}

export const getPicks = async (value) => {
  return []
}

export const selectPick = async (item) => {
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const getFilterValue = (value) => {
  return value
}
