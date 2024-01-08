import * as Process from '../Process/Process.js'
import * as GetBrowser from '../GetBrowser/GetBrowser.js'

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
  const browser = GetBrowser.getBrowser()
  return {
    ...state,
    productName: 'Lvce Editor',
    version: Process.version,
    commit: Process.commit,
    date: Process.date,
    browser,
  }
}
