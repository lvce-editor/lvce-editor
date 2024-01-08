import * as Process from '../Process/Process.js'

export const create = () => {
  return {
    productName: '',
    version: '',
    commit: '',
    date: '',
    browser: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    productName: 'Lvce Editor',
    version: Process.version,
    commit: Process.commit,
    date: Process.date,
    browser: '',
  }
}
