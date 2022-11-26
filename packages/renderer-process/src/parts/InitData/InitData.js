import * as Location from '../Location/Location.js'
import * as Layout from '../Layout/Layout.js'

export const getInitData = () => {
  const initData = {
    Location: {
      href: Location.getHref(),
    },
    Layout: {
      bounds: Layout.getBounds(),
    },
    LocalStorage: {
      savedState: localStorage.getItem('stateToSave'),
    },
  }
  return initData
}
