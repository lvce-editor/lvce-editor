// import * as ViewService from '../ViewService/ViewService.js'

export const name = 'workspace-symbol'

export const getPlaceholder = () => {
  return ''
}

export const getHelpEntries = () => {
  return []
}

export const getNoResults = () => {
  return {
    label: 'no workspace symbols found',
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
