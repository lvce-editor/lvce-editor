import * as Location from '../Location/Location.ts'
import * as Layout from '../Layout/Layout.ts'

export const getInitData = () => {
  const initData = {
    Location: {
      href: Location.getHref(),
    },
    Layout: {
      bounds: Layout.getBounds(),
    },
  }
  return initData
}
