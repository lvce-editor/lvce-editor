import * as Location from '../Location/Location.js'
import * as Layout from '../Layout/Layout.js'
import * as LocalStorage from '../StorageLocal/StorageLocal.js/index.js'

export const getInitData = () => {
  const initData = {
    Location: {
      href: Location.getHref(),
    },
    Layout: {
      bounds: Layout.getBounds(),
    },
    LocalStorage: {
      savedState: LocalStorage.getItem('stateToSave'),
      layout: LocalStorage.getItem('layout'),
    },
  }
  return initData
}
