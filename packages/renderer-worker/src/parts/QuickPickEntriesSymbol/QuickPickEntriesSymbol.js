/**
 * @enum {string}
 */
export const UiStrings = {
  NoSymbolFound: 'No symbol found',
}

export const name = 'symbol'

export const getPlaceholder = () => {
  return ''
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return {
    label: UiStrings.NoSymbolFound,
  }
}

export const getPicks = async () => {
  const picks = []
  return picks
}

export const selectPick = async (item) => {
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
