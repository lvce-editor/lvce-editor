export const name = 'noop'

export const getPlaceholder = () => {
  return ''
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return 'No Results'
}

export const getPicks = async (value) => {
  return []
}

export const selectPick = async (item) => {
  return {
    command: 'hide',
  }
}

export const getFilterValue = (value) => {
  return value
}
